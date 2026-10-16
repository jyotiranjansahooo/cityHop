
import { Router } from "express";

import {
  createReview,
  getHostelReviews,
  updateMyReview,
  deleteMyReview,
} from "../controllers/review.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Public: view reviews for a hostel
router.get("/hostel/:hostelId", getHostelReviews);

// Authenticated users: create and manage their own reviews
router.post("/", protect, authorize("user"), createReview);
router.patch("/:id", protect, authorize("user"), updateMyReview);
router.delete("/:id", protect, authorize("user"), deleteMyReview);

export default router;
