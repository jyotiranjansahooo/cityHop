import type { Response } from "express";
import { Types } from "mongoose";

import type { AuthRequest } from "../middleware/auth.middleware.js";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Hostel from "../models/Hostel.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";

type ReviewBody = {
  booking?: unknown;
  rating?: unknown;
  comment?: unknown;
};

const isValidId = (value: unknown): value is string =>
  typeof value === "string" && Types.ObjectId.isValid(value);

const getReviewInput = (
  body: ReviewBody,
): { rating: number; comment: string } | null => {
  if (
    typeof body.rating !== "number" ||
    !Number.isInteger(body.rating) ||
    body.rating < 1 ||
    body.rating > 5 ||
    typeof body.comment !== "string"
  ) {
    return null;
  }

  const comment = body.comment.trim();

  if (comment.length < 5 || comment.length > 1000) {
    return null;
  }

  return { rating: body.rating, comment };
};

export const createReview = async (
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

    const body = req.body as ReviewBody;
    const input = getReviewInput(body);

    if (!isValidId(body.booking) || !input) {
      res.status(400).json({
        success: false,
        message:
          "Provide a valid booking ID, rating from 1 to 5, and review of 5–1000 characters",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("_id role isActive");

    if (!user || !user.isActive || user.role !== "user") {
      res.status(403).json({
        success: false,
        message: "An active user account is required to submit a review",
      });
      return;
    }

    const booking = await Booking.findOne({
      _id: body.booking,
      user: req.user.id,
      status: "approved",
    });

    if (!booking) {
      res.status(403).json({
        success: false,
        message: "You can review only a hostel with your own approved booking",
      });
      return;
    }

    const hostel = await Hostel.findOne({
      _id: booking.hostel,
      isActive: true,
    }).select("_id");

    if (!hostel) {
      res.status(404).json({
        success: false,
        message: "Hostel not found or inactive",
      });
      return;
    }

    const review = await Review.create({
      user: user._id,
      hostel: hostel._id,
      booking: booking._id,
      rating: input.rating,
      comment: input.comment,
    });

    const createdReview = await Review.findById(review._id)
      .populate("user", "name")
      .lean();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: createdReview,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        success: false,
        message: "This booking already has a review",
      });
      return;
    }

    logger.error({ error }, "Failed to create review");

    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};

export const getHostelReviews = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { hostelId } = req.params;

    if (!isValidId(hostelId)) {
      res.status(400).json({
        success: false,
        message: "Invalid hostel ID",
      });
      return;
    }

    const hostel = await Hostel.findOne({
      _id: hostelId,
      isActive: true,
    }).select("_id");

    if (!hostel) {
      res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
      return;
    }

    const reviews = await Review.find({ hostel: hostel._id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews === 0
        ? 0
        : Math.round(
            (reviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews) *
              10,
          ) / 10;

    res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating,
      data: reviews,
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch hostel reviews");

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

export const updateMyReview = async (
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

    if (!isValidId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
      return;
    }

    const body = req.body as ReviewBody;
    const input = getReviewInput(body);

    if (!input) {
      res.status(400).json({
        success: false,
        message: "Rating must be 1–5 and review must contain 5–1000 characters",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("_id role isActive");

    if (!user || !user.isActive || user.role !== "user") {
      res.status(403).json({
        success: false,
        message: "An active user account is required",
      });
      return;
    }

    const review = await Review.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review not found",
      });
      return;
    }

    review.rating = input.rating;
    review.comment = input.comment;

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .lean();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    logger.error({ error }, "Failed to update review");

    res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

export const deleteMyReview = async (
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

    if (!isValidId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
      return;
    }

    const user = await User.findById(req.user.id).select("_id role isActive");

    if (!user || !user.isActive || user.role !== "user") {
      res.status(403).json({
        success: false,
        message: "An active user account is required",
      });
      return;
    }

    const review = await Review.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    logger.error({ error }, "Failed to delete review");

    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

export const adminDeleteReview = async (
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

    if (!isValidId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
      return;
    }

    const admin = await User.findById(req.user.id).select("_id role isActive");

    if (!admin || admin.role !== "admin" || !admin.isActive) {
      res.status(403).json({
        success: false,
        message: "Active admin access is required",
      });
      return;
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Review removed successfully",
    });
  } catch (error) {
    logger.error({ error }, "Admin failed to delete review");

    res.status(500).json({
      success: false,
      message: "Failed to remove review",
    });
  }
};
