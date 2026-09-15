import { Types } from "mongoose";
import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";
import City from "../models/City.js";
import User from "../models/User.js";
import Hostel from "../models/Hostel.js";
import Booking from "../models/Booking.js";
import logger from "../utils/logger.js";
import Area from "../models/Area.js";

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
export const getHostelById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || id.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Invalid hostel ID",
      });
      return;
    }

    const hostel = await Hostel.findById(id)
      .populate("owner", "name email role isActive")
      .populate("city", "name isActive")
      .populate("area", "name isActive");

    if (!hostel) {
      res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
      return;
    }

    const bookingStats = await Booking.aggregate([
      {
        $match: {
          hostel: hostel._id,
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const bookings = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
    };

    for (const item of bookingStats) {
      const status = item._id as
        | "pending"
        | "approved"
        | "rejected"
        | "cancelled";

      const count = item.count as number;

      bookings.total += count;

      if (status === "pending") {
        bookings.pending = count;
      }

      if (status === "approved") {
        bookings.approved = count;
      }

      if (status === "rejected") {
        bookings.rejected = count;
      }

      if (status === "cancelled") {
        bookings.cancelled = count;
      }
    }

    res.status(200).json({
      success: true,

      hostel,

      statistics: {
        bookings,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to get hostel details");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createCity = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      res.status(400).json({
        success: false,
        message: "City name is required",
      });
      return;
    }

    const cityName = name.trim();

    if (!cityName) {
      res.status(400).json({
        success: false,
        message: "City name cannot be empty",
      });
      return;
    }

    const existingCity = await City.findOne({
      name: {
        $regex: "^" + cityName + "$",
        $options: "i",
      },
    });

    if (existingCity) {
      res.status(409).json({
        success: false,
        message: "City already exists",
      });
      return;
    }

    const city = await City.create({
      name: cityName,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "City created successfully",
      city,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create city",
      error,
    });
  }
};

export const getAllCities = async (
  _req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const cities = await City.find().sort({ name: 1 }).lean();

    res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
      error,
    });
  }
};

export const updateCityStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
      return;
    }

    const city = await City.findById(id);

    if (!city) {
      res.status(404).json({
        success: false,
        message: "City not found",
      });
      return;
    }

    city.isActive = isActive;

    await city.save();

    res.status(200).json({
      success: true,
      message: isActive
        ? "City activated successfully"
        : "City deactivated successfully",
      city,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update city status",
      error,
    });
  }
};
export const createArea = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, cityId } = req.body;

    if (!name || typeof name !== "string") {
      res.status(400).json({
        success: false,
        message: "Area name is required",
      });
      return;
    }

    if (!cityId || typeof cityId !== "string") {
      res.status(400).json({
        success: false,
        message: "City ID is required",
      });
      return;
    }

    const areaName = name.trim();

    if (!areaName) {
      res.status(400).json({
        success: false,
        message: "Area name cannot be empty",
      });
      return;
    }

    const city = await City.findById(cityId);

    if (!city) {
      res.status(404).json({
        success: false,
        message: "City not found",
      });
      return;
    }

    const existingArea = await Area.findOne({
      name: {
        $regex: "^" + areaName + "$",
        $options: "i",
      },
      city: cityId,
    });

    if (existingArea) {
      res.status(409).json({
        success: false,
        message: "Area already exists in this city",
      });
      return;
    }

    const area = await Area.create({
      name: areaName,
      city: cityId,
      isActive: true,
    });

    const populatedArea = await Area.findById(area._id)
      .populate("city", "name")
      .lean();

    res.status(201).json({
      success: true,
      message: "Area created successfully",
      area: populatedArea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create area",
      error,
    });
  }
};

export const getAllAreas = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { cityId, isActive } = req.query;

    interface AreaFilter {
      city?: string;
      isActive?: boolean;
    }

    const filter: AreaFilter = {};

    if (typeof cityId === "string" && cityId.trim()) {
      filter.city = cityId;
    }

    if (typeof isActive === "string") {
      if (isActive === "true") {
        filter.isActive = true;
      }

      if (isActive === "false") {
        filter.isActive = false;
      }
    }

    const areas = await Area.find(filter)
      .populate("city", "name")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: areas.length,
      areas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch areas",
      error,
    });
  }
};

export const updateAreaStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
      return;
    }

    const area = await Area.findById(id);

    if (!area) {
      res.status(404).json({
        success: false,
        message: "Area not found",
      });
      return;
    }

    area.isActive = isActive;

    await area.save();

    const populatedArea = await Area.findById(area._id)
      .populate("city", "name")
      .lean();

    res.status(200).json({
      success: true,
      message: isActive
        ? "Area activated successfully"
        : "Area deactivated successfully",
      area: populatedArea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update area status",
      error,
    });
  }
};

export const approveAdminBooking = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
      return;
    }

    const booking = await Booking.findById(id);

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

    const conflictingBooking = await Booking.findOne({
      _id: {
        $ne: booking._id,
      },
      hostel: booking.hostel,
      status: "approved",
      checkInDate: {
        $lt: booking.checkOutDate,
      },
      checkOutDate: {
        $gt: booking.checkInDate,
      },
    });

    if (conflictingBooking) {
      res.status(409).json({
        success: false,
        message: "This booking conflicts with an existing approved booking",
      });
      return;
    }

    booking.status = "approved";

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email")
      .populate("owner", "name email")
      .populate("hostel", "name")
      .lean();

    res.status(200).json({
      success: true,
      message: "Booking approved successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve booking",
      error,
    });
  }
};

export const rejectAdminBooking = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid booking ID" });
      return;
    }

    if (rejectionReason !== undefined && typeof rejectionReason !== "string") {
      res.status(400).json({
        success: false,
        message: "Rejection reason must be a string",
      });
      return;
    }

    const booking = await Booking.findById(id);

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

    if (typeof rejectionReason === "string") {
      const reason = rejectionReason.trim();

      if (reason) {
        booking.rejectionReason = reason;
      }
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email")
      .populate("owner", "name email")
      .populate("hostel", "name")
      .lean();

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reject booking",
      error,
    });
  }
};

export const cancelAdminBooking = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid booking ID" });
      return;
    }

    if (
      cancellationReason !== undefined &&
      typeof cancellationReason !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Cancellation reason must be a string",
      });
      return;
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    if (booking.status !== "pending" && booking.status !== "approved") {
      res.status(400).json({
        success: false,
        message: "Only pending or approved bookings can be cancelled",
      });
      return;
    }

    booking.status = "cancelled";

    if (typeof cancellationReason === "string") {
      const reason = cancellationReason.trim();

      if (reason) {
        booking.cancellationReason = reason;
      }
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email")
      .populate("owner", "name email")
      .populate("hostel", "name")
      .lean();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error,
    });
  }
};
export const updateOwnerStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid owner ID",
      });
      return;
    }

    if (typeof isActive !== "boolean") {
      res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
      return;
    }

    const owner = await User.findById(id);

    if (!owner) {
      res.status(404).json({
        success: false,
        message: "Owner not found",
      });
      return;
    }

    if (owner.role !== "owner") {
      res.status(400).json({
        success: false,
        message: "The selected user is not an owner",
      });
      return;
    }

    owner.isActive = isActive;

    await owner.save();

    let affectedHostels = 0;

    if (!isActive) {
      const hostelUpdateResult = await Hostel.updateMany(
        {
          owner: owner._id,
          isActive: true,
        },
        {
          $set: {
            isActive: false,
          },
        },
      );

      affectedHostels = hostelUpdateResult.modifiedCount;
    }

    const updatedOwner = await User.findById(owner._id)
      .select("-password")
      .lean();

    res.status(200).json({
      success: true,
      message: isActive
        ? "Owner activated successfully"
        : "Owner deactivated successfully",
      owner: updatedOwner,
      affectedHostels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update owner status",
      error,
    });
  }
};
