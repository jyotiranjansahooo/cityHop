import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";
import Hostel from "../models/Hostel.js";
import Booking from "../models/Booking.js";
import logger from "../utils/logger.js";
import { Types } from "mongoose";

export const getOwnerDashboard = async (
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

    const ownerId = req.user.id;

    const [
      totalHostels,
      activeHostels,
      inactiveHostels,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      earningsResult,
      recentBookings,
      recentHostels,
    ] = await Promise.all([
      Hostel.countDocuments({
        owner: ownerId,
      }),

      Hostel.countDocuments({
        owner: ownerId,
        isActive: true,
      }),

      Hostel.countDocuments({
        owner: ownerId,
        isActive: false,
      }),

      Booking.countDocuments({
        owner: ownerId,
      }),

      Booking.countDocuments({
        owner: ownerId,
        status: "pending",
      }),

      Booking.countDocuments({
        owner: ownerId,
        status: "approved",
      }),

      Booking.countDocuments({
        owner: ownerId,
        status: "rejected",
      }),

      Booking.aggregate([
        {
          $match: {
            owner: new Types.ObjectId(ownerId),
            status: "approved",
          },
        },
        {
          $group: {
            _id: null,
            totalEarnings: {
              $sum: "$monthlyRent",
            },
          },
        },
      ]),

      Booking.find({
        owner: ownerId,
      })
        .populate("user", "name email")
        .populate("hostel", "name images")
        .sort({
          createdAt: -1,
        })
        .limit(5),

      Hostel.find({
        owner: ownerId,
      })
        .select("name images monthlyRent isActive createdAt")
        .sort({
          createdAt: -1,
        })
        .limit(5),
    ]);

    const totalEarnings =
      earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

    res.status(200).json({
      success: true,

      dashboard: {
        hostels: {
          total: totalHostels,
          active: activeHostels,
          inactive: inactiveHostels,
        },

        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          approved: approvedBookings,
          rejected: rejectedBookings,
        },

        earnings: {
          total: totalEarnings,
        },

        recentBookings,
        recentHostels,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to get owner dashboard");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
