import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    logger.info(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "New user registered",
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error({ error }, "User registration failed");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
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

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    logger.info(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "User logged in",
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error({ error }, "User login failed");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to get current user");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getOwnerProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get owner profile");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updateOwnerProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { name, email } = req.body;

    if (
      name !== undefined &&
      (typeof name !== "string" || name.trim().length === 0)
    ) {
      res.status(400).json({
        success: false,
        message: "Name must be a valid non-empty string",
      });
      return;
    }

    if (
      email !== undefined &&
      (typeof email !== "string" || email.trim().length === 0)
    ) {
      res.status(400).json({
        success: false,
        message: "Email must be a valid non-empty string",
      });
      return;
    }

    if (name === undefined && email === undefined) {
      res.status(400).json({
        success: false,
        message: "At least one field is required",
      });
      return;
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (typeof name === "string") {
      user.name = name.trim();
    }

    if (typeof email === "string") {
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: user._id,
          },
        });

        if (existingUser) {
          res.status(409).json({
            success: false,
            message: "Email is already in use",
          });
          return;
        }

        user.email = normalizedEmail;
      }
    }

    await user.save();

    logger.info(
      {
        userId: user._id.toString(),
      },
      "Owner profile updated",
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to update owner profile");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const changeOwnerPassword = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (
      typeof currentPassword !== "string" ||
      currentPassword.length === 0 ||
      typeof newPassword !== "string" ||
      newPassword.length === 0
    ) {
      res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
      return;
    }

    user.password = newPassword;

    await user.save();

    logger.info(
      {
        userId: user._id.toString(),
      },
      "Owner password changed",
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error({ error }, "Failed to change owner password");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
