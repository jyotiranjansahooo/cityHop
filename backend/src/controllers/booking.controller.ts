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
export const approveBooking = async (
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

    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
      return;
    }

    const booking = await Booking.findOne({
      _id: id,
      owner: req.user.id,
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    if (booking.status !== "pending") {
      res.status(400).json({
        success: false,
        message: "Only pending bookings can be approved",
      });
      return;
    }

    booking.status = "approved";

    await booking.save();

    logger.info(
      {
        bookingId: booking._id.toString(),
        ownerId: req.user.id,
      },
      "Booking approved",
    );

    res.status(200).json({
      success: true,
      message: "Booking approved successfully",
      booking,
    });
  } catch (error) {
    logger.error({ error }, "Failed to approve booking");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const rejectBooking = async (
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

    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
      return;
    }

    const booking = await Booking.findOne({
      _id: id,
      owner: req.user.id,
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    if (booking.status !== "pending") {
      res.status(400).json({
        success: false,
        message: "Only pending bookings can be rejected",
      });
      return;
    }

    booking.status = "rejected";

    if (
      typeof rejectionReason === "string" &&
      rejectionReason.trim().length > 0
    ) {
      booking.rejectionReason = rejectionReason.trim();
    }

    await booking.save();

    logger.info(
      {
        bookingId: booking._id.toString(),
        ownerId: req.user.id,
      },
      "Booking rejected",
    );

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    logger.error({ error }, "Failed to reject booking");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getOwnerBookingById = async (
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

    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
      return;
    }

    const booking = await Booking.findOne({
      _id: id,
      owner: req.user.id,
    })
      .populate("user", "name email")
      .populate("hostel", "name images address monthlyRent city area");

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get owner booking details");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
