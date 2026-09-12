import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";
import Booking from "../models/Booking.js";
import logger from "../utils/logger.js";

export const getOwnerBookings = async (
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

    const bookings = await Booking.find({
      owner: req.user.id,
    })
      .populate("user", "name email")
      .populate("hostel", "name images city area monthlyRent")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get owner bookings");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
