import { Types } from "mongoose";
import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import Hostel from "../models/Hostel.js";
import Booking from "../models/Booking.js";
import logger from "../utils/logger.js";

export const getAdminDashboard = async (
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

    const [
      totalUsers,
      totalOwners,
      totalNormalUsers,
      totalAdmins,
      activeUsers,
      inactiveUsers,

      totalHostels,
      activeHostels,
      inactiveHostels,

      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      cancelledBookings,

      recentUsers,
      recentHostels,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "owner",
      }),

      User.countDocuments({
        role: "user",
      }),

      User.countDocuments({
        role: "admin",
      }),

      User.countDocuments({
        isActive: true,
      }),

      User.countDocuments({
        isActive: false,
      }),

      Hostel.countDocuments(),

      Hostel.countDocuments({
        isActive: true,
      }),

      Hostel.countDocuments({
        isActive: false,
      }),

      Booking.countDocuments(),

      Booking.countDocuments({
        status: "pending",
      }),

      Booking.countDocuments({
        status: "approved",
      }),

      Booking.countDocuments({
        status: "rejected",
      }),

      Booking.countDocuments({
        status: "cancelled",
      }),

      User.find()
        .select("-password")
        .sort({
          createdAt: -1,
        })
        .limit(5),

      Hostel.find()
        .populate("owner", "name email")
        .populate("city", "name")
        .populate("area", "name")
        .sort({
          createdAt: -1,
        })
        .limit(5),

      Booking.find()
        .populate("user", "name email")
        .populate("owner", "name email")
        .populate("hostel", "name images")
        .sort({
          createdAt: -1,
        })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,

      dashboard: {
        users: {
          total: totalUsers,
          normalUsers: totalNormalUsers,
          owners: totalOwners,
          admins: totalAdmins,
          active: activeUsers,
          inactive: inactiveUsers,
        },

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
          cancelled: cancelledBookings,
        },

        recentUsers,
        recentHostels,
        recentBookings,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to get admin dashboard");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const pageValue =
      typeof req.query.page === "string" ? Number(req.query.page) : 1;

    const limitValue =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 10;

    const page =
      Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;

    const limit =
      Number.isFinite(limitValue) && limitValue > 0
        ? Math.min(Math.floor(limitValue), 100)
        : 10;

    const skip = (page - 1) * limit;

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const role =
      typeof req.query.role === "string" ? req.query.role : undefined;

    const isActiveQuery =
      typeof req.query.isActive === "string" ? req.query.isActive : undefined;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (role === "user" || role === "owner" || role === "admin") {
      filter.role = role;
    }

    if (isActiveQuery === "true") {
      filter.isActive = true;
    }

    if (isActiveQuery === "false") {
      filter.isActive = false;
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,

      count: users.length,

      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },

      users,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get users");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updateUserStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof id !== "string" || id.length === 0) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    if (typeof isActive !== "boolean") {
      res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user._id.toString() === req.user?.id) {
      res.status(400).json({
        success: false,
        message: "You cannot change your own account status",
      });
      return;
    }

    user.isActive = isActive;

    await user.save();

    logger.info(
      {
        userId: user._id.toString(),
        adminId: req.user?.id,
        isActive,
      },
      "Admin updated user status",
    );

    res.status(200).json({
      success: true,
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to update user status");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllHostels = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const pageValue =
      typeof req.query.page === "string" ? Number(req.query.page) : 1;

    const limitValue =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 10;

    const page =
      Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;

    const limit =
      Number.isFinite(limitValue) && limitValue > 0
        ? Math.min(Math.floor(limitValue), 100)
        : 10;

    const skip = (page - 1) * limit;

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const city =
      typeof req.query.city === "string" ? req.query.city : undefined;

    const area =
      typeof req.query.area === "string" ? req.query.area : undefined;

    const type =
      typeof req.query.type === "string" ? req.query.type : undefined;

    const isActiveQuery =
      typeof req.query.isActive === "string" ? req.query.isActive : undefined;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (city) {
      filter.city = city;
    }

    if (area) {
      filter.area = area;
    }

    if (type) {
      filter.type = type;
    }

    if (isActiveQuery === "true") {
      filter.isActive = true;
    }

    if (isActiveQuery === "false") {
      filter.isActive = false;
    }

    const [hostels, totalHostels] = await Promise.all([
      Hostel.find(filter)
        .populate("owner", "name email")
        .populate("city", "name")
        .populate("area", "name")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Hostel.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,

      count: hostels.length,

      pagination: {
        page,
        limit,
        totalHostels,
        totalPages: Math.ceil(totalHostels / limit),
      },

      hostels,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get all hostels");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updateHostelStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof id !== "string" || id.length === 0) {
      res.status(400).json({
        success: false,
        message: "Invalid hostel ID",
      });
      return;
    }

    if (typeof isActive !== "boolean") {
      res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
      return;
    }

    const hostel = await Hostel.findById(id);

    if (!hostel) {
      res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
      return;
    }

    hostel.isActive = isActive;

    await hostel.save();

    logger.info(
      {
        hostelId: hostel._id.toString(),
        adminId: req.user?.id,
        isActive,
      },
      "Admin updated hostel status",
    );

    res.status(200).json({
      success: true,
      message: isActive
        ? "Hostel activated successfully"
        : "Hostel deactivated successfully",

      hostel: {
        id: hostel._id,
        name: hostel.name,
        isActive: hostel.isActive,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to update hostel status");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllBookings = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const pageValue =
      typeof req.query.page === "string" ? Number(req.query.page) : 1;

    const limitValue =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 10;

    const page =
      Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1;

    const limit =
      Number.isFinite(limitValue) && limitValue > 0
        ? Math.min(Math.floor(limitValue), 100)
        : 10;

    const skip = (page - 1) * limit;

    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const filter: Record<string, unknown> = {};

    if (
      status === "pending" ||
      status === "approved" ||
      status === "rejected" ||
      status === "cancelled"
    ) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        {
          _id: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const [bookings, totalBookings] = await Promise.all([
      Booking.find(filter)
        .populate("user", "name email")
        .populate("owner", "name email")
        .populate("hostel", "name images address monthlyRent")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Booking.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,

      count: bookings.length,

      pagination: {
        page,
        limit,
        totalBookings,
        totalPages: Math.ceil(totalBookings / limit),
      },

      bookings,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get all bookings");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getBookingById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || id.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
      return;
    }

    const booking = await Booking.findById(id)
      .populate("user", "name email role isActive")
      .populate("owner", "name email role isActive")
      .populate({
        path: "hostel",
        populate: [
          {
            path: "city",
            select: "name",
          },
          {
            path: "area",
            select: "name",
          },
        ],
      });

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
    logger.error({ error }, "Failed to get booking details");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getUserById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || id.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const [hostelCount, bookingCount] = await Promise.all([
      user.role === "owner"
        ? Hostel.countDocuments({
            owner: user._id,
          })
        : Promise.resolve(0),

      user.role === "user"
        ? Booking.countDocuments({
            user: user._id,
          })
        : Promise.resolve(0),
    ]);

    res.status(200).json({
      success: true,

      user,

      statistics: {
        totalHostels: hostelCount,
        totalBookings: bookingCount,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to get user details");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
