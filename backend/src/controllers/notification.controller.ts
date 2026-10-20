
import type { Response } from "express";
import { Types } from "mongoose";

import type { AuthRequest } from "../middleware/auth.middleware.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";

export const getMyNotifications = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("_id isActive");

    if (!user || !user.isActive) {
      res.status(403).json({
        success: false,
        message: "An active account is required",
      });
      return;
    }

    const pageValue = req.query.page ?? "1";
    const limitValue = req.query.limit ?? "10";

    if (
      typeof pageValue !== "string" ||
      typeof limitValue !== "string" ||
      pageValue.trim() === "" ||
      limitValue.trim() === ""
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid pagination values",
      });
      return;
    }

    const page = Number(pageValue);
    const limit = Number(limitValue);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      res.status(400).json({
        success: false,
        message: "Page must be positive and limit must be between 1 and 100",
      });
      return;
    }

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: user._id })
        .populate("actor", "name")
        .populate("booking", "status checkInDate checkOutDate")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Notification.countDocuments({ recipient: user._id }),

      Notification.countDocuments({
        recipient: user._id,
        isRead: false,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        unreadCount,
      },
    });
  } catch (error: unknown) {
    logger.error({ error }, "Failed to fetch notifications");

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { id } = req.params;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("_id isActive");

    if (!user || !user.isActive) {
      res.status(403).json({
        success: false,
        message: "An active account is required",
      });
      return;
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        recipient: user._id,
      },
      {
        $set: { isRead: true },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("actor", "name")
      .populate("booking", "status checkInDate checkOutDate")
      .lean();

    if (!notification) {
      res.status(404).json({
        success: false,
        message: "Notification not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error: unknown) {
    logger.error({ error }, "Failed to mark notification as read");

    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

export const markAllNotificationsAsRead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("_id isActive");

    if (!user || !user.isActive) {
      res.status(403).json({
        success: false,
        message: "An active account is required",
      });
      return;
    }

    const result = await Notification.updateMany(
      {
        recipient: user._id,
        isRead: false,
      },
      {
        $set: { isRead: true },
      },
    );

    res.status(200).json({
      success: true,
      message: "Notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error: unknown) {
    logger.error({ error }, "Failed to mark all notifications as read");

    res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
};
