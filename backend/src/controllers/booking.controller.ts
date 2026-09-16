import type { AuthRequest } from "../middleware/auth.middleware.js";
import Booking from "../models/Booking.js";
import Hostel from "../models/Hostel.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import { Types } from "mongoose";
import type { Request, Response } from "express";

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

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
      return;
    }

    if (!Types.ObjectId.isValid(req.user.id)) {
      res.status(400).json({
        success: false,
        message: "Invalid owner ID",
      });
      return;
    }

    const owner = await User.findById(req.user.id).select("_id role isActive");

    if (!owner || owner.role !== "owner") {
      res.status(403).json({
        success: false,
        message: "Only owners can approve bookings",
      });
      return;
    }

    if (!owner.isActive) {
      res.status(403).json({
        success: false,
        message: "Your owner account is inactive",
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

    const hostel = await Hostel.findById(booking.hostel).select(
      "_id owner isActive",
    );

    if (!hostel) {
      res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
      return;
    }

    if (hostel.owner.toString() !== owner._id.toString()) {
      res.status(403).json({
        success: false,
        message: "This hostel does not belong to your owner account",
      });
      return;
    }

    if (!hostel.isActive) {
      res.status(403).json({
        success: false,
        message: "This hostel is inactive",
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
      .populate("hostel", "name images city area monthlyRent");

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
      booking: updatedBooking,
    });
  } catch (error) {
    logger.error({ error }, "Failed to approve booking");

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createBooking = async (
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

    const { hostel, checkInDate, checkOutDate, guests } = req.body;

    if (!hostel || typeof hostel !== "string") {
      res.status(400).json({
        success: false,
        message: "Hostel ID is required",
      });
      return;
    }

    if (!Types.ObjectId.isValid(hostel)) {
      res.status(400).json({
        success: false,
        message: "Invalid hostel ID",
      });
      return;
    }

    if (!checkInDate || !checkOutDate) {
      res.status(400).json({
        success: false,
        message: "Check-in and check-out dates are required",
      });
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid booking dates",
      });
      return;
    }

    if (checkIn >= checkOut) {
      res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
      return;
    }

    const currentDate = new Date();

    if (checkIn < currentDate) {
      res.status(400).json({
        success: false,
        message: "Check-in date cannot be in the past",
      });
      return;
    }

    if (
      guests === undefined ||
      guests === null ||
      typeof guests !== "number" ||
      !Number.isInteger(guests) ||
      guests < 1
    ) {
      res.status(400).json({
        success: false,
        message: "Guests must be a positive whole number",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("_id role isActive");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.role !== "user") {
      res.status(403).json({
        success: false,
        message: "Only normal users can create bookings",
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

    const hostelData = await Hostel.findOne({
      _id: hostel,
      isActive: true,
    }).select("_id owner monthlyRent isActive");

    if (!hostelData) {
      res.status(404).json({
        success: false,
        message: "Hostel not found or is inactive",
      });
      return;
    }

    const owner = await User.findOne({
      _id: hostelData.owner,
      role: "owner",
      isActive: true,
    }).select("_id");

    if (!owner) {
      res.status(400).json({
        success: false,
        message: "This hostel is currently unavailable",
      });
      return;
    }

    const existingBooking = await Booking.findOne({
      hostel: hostelData._id,
      status: "approved",
      checkInDate: {
        $lt: checkOut,
      },
      checkOutDate: {
        $gt: checkIn,
      },
    });

    if (existingBooking) {
      res.status(409).json({
        success: false,
        message: "Hostel is already booked for the selected dates",
      });
      return;
    }

    const existingUserBooking = await Booking.findOne({
      user: req.user.id,
      hostel: hostelData._id,
      status: {
        $in: ["pending", "approved"],
      },
      checkInDate: {
        $lt: checkOut,
      },
      checkOutDate: {
        $gt: checkIn,
      },
    });

    if (existingUserBooking) {
      res.status(409).json({
        success: false,
        message: "You already have a booking for these dates",
      });
      return;
    }

    const booking = await Booking.create({
      user: req.user.id,
      hostel: hostelData._id,
      owner: hostelData.owner,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      status: "pending",
      monthlyRent: hostelData.monthlyRent,
    });

    const createdBooking = await Booking.findById(booking._id)
      .populate("hostel", "name address type monthlyRent images")
      .populate("owner", "name email")
      .populate("user", "name email")
      .lean();

    res.status(201).json({
      success: true,
      message: "Booking request created successfully",
      data: createdBooking,
    });
  } catch (error) {
    logger.error({ error }, "Failed to create booking");

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
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

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
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

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
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

export const getMyBookings = async (
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

    const user = await User.findById(req.user.id).select("_id role isActive");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.role !== "user") {
      res.status(403).json({
        success: false,
        message: "Only normal users can access their bookings",
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

    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("hostel", "name address type monthlyRent images city area")
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch user bookings");

    res.status(500).json({
      success: false,
      message: "Failed to fetch your bookings",
    });
  }
};

export const getMyBookingById = async (
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
        message: "Invalid booking ID",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("_id role isActive");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.role !== "user") {
      res.status(403).json({
        success: false,
        message: "Only normal users can access their bookings",
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

    const booking = await Booking.findOne({
      _id: id,
      user: req.user.id,
    })
      .populate(
        "hostel",
        "name address type monthlyRent securityDeposit amenities images description city area",
      )
      .populate("owner", "name email")
      .lean();

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch booking details");

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking details",
    });
  }
};

export const cancelMyBooking = async (
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
        message: "Invalid booking ID",
      });
      return;
    }

    const user = await User.findById(req.user.id).select(
      "_id role isActive",
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.role !== "user") {
      res.status(403).json({
        success: false,
        message: "Only normal users can cancel their bookings",
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

    const booking = await Booking.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }

    if (
      booking.status !== "pending" &&
      booking.status !== "approved"
    ) {
      res.status(400).json({
        success: false,
        message: "This booking cannot be cancelled",
      });
      return;
    }

    booking.status = "cancelled";
    booking.cancellationReason = "Cancelled by user";

    await booking.save();

    const cancelledBooking = await Booking.findById(booking._id)
      .populate(
        "hostel",
        "name address type monthlyRent securityDeposit amenities images",
      )
      .populate("owner", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: cancelledBooking,
    });
  } catch (error) {
    logger.error({ error }, "Failed to cancel booking");

    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

