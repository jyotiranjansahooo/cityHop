
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import User from "../models/User.js";
import logger from "../utils/logger.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

interface JwtPayload {
  userId: string;
  role: string;
}

const isJwtPayload = (
  value: string | jwt.JwtPayload,
): value is JwtPayload => {
  if (typeof value === "string") {
    return false;
  }

  return (
    typeof value.userId === "string" &&
    typeof value.role === "string"
  );
};

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authorization = req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
      return;
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      logger.error("JWT_SECRET is not defined");

      res.status(500).json({
        success: false,
        message: "Authentication service is not configured",
      });
      return;
    }

    const decoded = jwt.verify(token, secret);

    if (!isJwtPayload(decoded)) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    if (!Types.ObjectId.isValid(decoded.userId)) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    const user = await User.findById(decoded.userId).select(
      "_id role isActive",
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Authentication token has expired",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    logger.error(
      { error },
      "Authentication failed",
    );

    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
      return;
    }

    next();
  };
};

