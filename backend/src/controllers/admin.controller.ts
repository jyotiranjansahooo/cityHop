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
      totalHostelOwners,
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

      Hostel.distinct("owner").then((owners) => owners.length),

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
          owners: totalHostelOwners,
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

    if (role === "user" || role === "admin") {
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

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
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

    if (user._id.toString() === req.user.id) {
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
        adminId: req.user.id,
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
      if (!Types.ObjectId.isValid(city)) {
        res.status(400).json({
          success: false,
          message: "Invalid city ID",
        });
        return;
      }

      filter.city = city;
    }

    if (area) {
      if (!Types.ObjectId.isValid(area)) {
        res.status(400).json({
          success: false,
          message: "Invalid area ID",
        });
        return;
      }

      filter.area = area;
    }

    if (type) {
      if (!["boys", "girls", "co-living"].includes(type)) {
        res.status(400).json({
          success: false,
          message: "Invalid hostel type",
        });
        return;
      }

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

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
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
        adminId: req.user.id,
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

    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const validStatuses = [
      "pending",
      "approved",
      "rejected",
      "cancelled",
    ] as const;

    type BookingStatus = (typeof validStatuses)[number];

    const filter: Record<string, unknown> = {};

    if (status) {
      if (!validStatuses.includes(status as BookingStatus)) {
        res.status(400).json({
          success: false,
          message: "Invalid booking status",
        });
        return;
      }

      filter.status = status as BookingStatus;
    }

    const [bookings, totalBookings] = await Promise.all([
      Booking.find(filter)
        .populate("user", "name email")
        .populate("owner", "name email")
        .populate("hostel", "name images city area monthlyRent")
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

export const updateBookingStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
      return;
    }

    const validStatuses = [
      "pending",
      "approved",
      "rejected",
      "cancelled",
    ] as const;

    type BookingStatus = (typeof validStatuses)[number];

    if (
      typeof status !== "string" ||
      !validStatuses.includes(status as BookingStatus)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
      return;
    }

    const bookingStatus = status as BookingStatus;

    if (
      bookingStatus === "rejected" &&
      rejectionReason !== undefined &&
      typeof rejectionReason !== "string"
    ) {
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

    booking.status = bookingStatus;

    if (bookingStatus === "rejected") {
      booking.rejectionReason =
        typeof rejectionReason === "string" ? rejectionReason.trim() : null;
    } else {
      booking.rejectionReason = null;
    }

    await booking.save();

    logger.info(
      {
        bookingId: booking._id.toString(),
        adminId: req.user.id,
        status: bookingStatus,
      },
      "Admin updated booking status",
    );

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email")
      .populate("owner", "name email")
      .populate("hostel", "name images city area monthlyRent");

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    logger.error({ error }, "Failed to update booking status");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllCities = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const cities = await City.find()
      .sort({
        name: 1,
      })
      .lean();

    res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get all cities");

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
    const { name, state, country } = req.body;

    if (
      typeof name !== "string" ||
      typeof state !== "string" ||
      typeof country !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Name, state, and country are required",
      });
      return;
    }

    const trimmedName = name.trim();
    const trimmedState = state.trim();
    const trimmedCountry = country.trim();

    if (!trimmedName || !trimmedState || !trimmedCountry) {
      res.status(400).json({
        success: false,
        message: "Name, state, and country are required",
      });
      return;
    }

    const existingCity = await City.findOne({
      name: trimmedName,
      state: trimmedState,
      country: trimmedCountry,
    });

    if (existingCity) {
      res.status(409).json({
        success: false,
        message: "City already exists",
      });
      return;
    }

    const city = await City.create({
      name: trimmedName,
      state: trimmedState,
      country: trimmedCountry,
    });

    res.status(201).json({
      success: true,
      message: "City created successfully",
      city,
    });
  } catch (error) {
    logger.error({ error }, "Failed to create city");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCity = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, state, country, isActive } = req.body;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid city ID",
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

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        res.status(400).json({
          success: false,
          message: "Invalid city name",
        });
        return;
      }

      city.name = name.trim();
    }

    if (state !== undefined) {
      if (typeof state !== "string" || !state.trim()) {
        res.status(400).json({
          success: false,
          message: "Invalid state",
        });
        return;
      }

      city.state = state.trim();
    }

    if (country !== undefined) {
      if (typeof country !== "string" || !country.trim()) {
        res.status(400).json({
          success: false,
          message: "Invalid country",
        });
        return;
      }

      city.country = country.trim();
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        res.status(400).json({
          success: false,
          message: "isActive must be true or false",
        });
        return;
      }

      city.isActive = isActive;
    }

    await city.save();

    res.status(200).json({
      success: true,
      message: "City updated successfully",
      city,
    });
  } catch (error) {
    logger.error({ error }, "Failed to update city");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllAreas = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const cityId =
      typeof req.query.city === "string" ? req.query.city : undefined;

    const filter: Record<string, unknown> = {};

    if (cityId) {
      if (!Types.ObjectId.isValid(cityId)) {
        res.status(400).json({
          success: false,
          message: "Invalid city ID",
        });
        return;
      }

      filter.city = cityId;
    }

    const areas = await Area.find(filter)
      .populate("city", "name")
      .sort({
        name: 1,
      })
      .lean();

    res.status(200).json({
      success: true,
      count: areas.length,
      areas,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get all areas");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createArea = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, city, description, latitude, longitude, isActive } = req.body;

    if (typeof name !== "string" || typeof city !== "string") {
      res.status(400).json({
        success: false,
        message: "Name and city are required",
      });
      return;
    }

    if (!Types.ObjectId.isValid(city)) {
      res.status(400).json({
        success: false,
        message: "Invalid city ID",
      });
      return;
    }

    const cityExists = await City.findById(city);

    if (!cityExists) {
      res.status(404).json({
        success: false,
        message: "City not found",
      });
      return;
    }

    const existingArea = await Area.findOne({
      name: name.trim(),
      city,
    });

    if (existingArea) {
      res.status(409).json({
        success: false,
        message: "Area already exists in this city",
      });
      return;
    }

    const areaData: {
      name: string;
      city: Types.ObjectId;
      description?: string;
      latitude?: number;
      longitude?: number;
      isActive?: boolean;
    } = {
      name: name.trim(),
      city: new Types.ObjectId(city),
    };

    if (description !== undefined) {
      if (typeof description !== "string") {
        res.status(400).json({
          success: false,
          message: "Description must be a string",
        });
        return;
      }

      areaData.description = description.trim();
    }

    if (latitude !== undefined) {
      const latitudeNumber = Number(latitude);

      if (!Number.isFinite(latitudeNumber)) {
        res.status(400).json({
          success: false,
          message: "Invalid latitude",
        });
        return;
      }

      areaData.latitude = latitudeNumber;
    }

    if (longitude !== undefined) {
      const longitudeNumber = Number(longitude);

      if (!Number.isFinite(longitudeNumber)) {
        res.status(400).json({
          success: false,
          message: "Invalid longitude",
        });
        return;
      }

      areaData.longitude = longitudeNumber;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        res.status(400).json({
          success: false,
          message: "isActive must be true or false",
        });
        return;
      }

      areaData.isActive = isActive;
    }

    const area = await Area.create(areaData);

    res.status(201).json({
      success: true,
      message: "Area created successfully",
      area,
    });
  } catch (error) {
    logger.error({ error }, "Failed to create area");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateArea = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid area ID",
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

    const { name, city, description, latitude, longitude, isActive } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        res.status(400).json({
          success: false,
          message: "Invalid area name",
        });
        return;
      }

      area.name = name.trim();
    }

    if (city !== undefined) {
      if (typeof city !== "string" || !Types.ObjectId.isValid(city)) {
        res.status(400).json({
          success: false,
          message: "Invalid city ID",
        });
        return;
      }

      const cityExists = await City.findById(city);

      if (!cityExists) {
        res.status(404).json({
          success: false,
          message: "City not found",
        });
        return;
      }

      area.city = new Types.ObjectId(city);
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        res.status(400).json({
          success: false,
          message: "Description must be a string",
        });
        return;
      }

      area.description = description.trim();
    }

    if (latitude !== undefined) {
      const latitudeNumber = Number(latitude);

      if (!Number.isFinite(latitudeNumber)) {
        res.status(400).json({
          success: false,
          message: "Invalid latitude",
        });
        return;
      }

      area.latitude = latitudeNumber;
    }

    if (longitude !== undefined) {
      const longitudeNumber = Number(longitude);

      if (!Number.isFinite(longitudeNumber)) {
        res.status(400).json({
          success: false,
          message: "Invalid longitude",
        });
        return;
      }

      area.longitude = longitudeNumber;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        res.status(400).json({
          success: false,
          message: "isActive must be true or false",
        });
        return;
      }

      area.isActive = isActive;
    }

    await area.save();

    res.status(200).json({
      success: true,
      message: "Area updated successfully",
      area,
    });
  } catch (error) {
    logger.error({ error }, "Failed to update area");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteArea = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid area ID",
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

    const hostelCount = await Hostel.countDocuments({
      area: area._id,
    });

    if (hostelCount > 0) {
      res.status(400).json({
        success: false,
        message: "Cannot delete area while hostels are assigned to it",
      });
      return;
    }

    await area.deleteOne();

    res.status(200).json({
      success: true,
      message: "Area deleted successfully",
    });
  } catch (error) {
    logger.error({ error }, "Failed to delete area");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
