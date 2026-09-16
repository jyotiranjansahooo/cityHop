import { Router } from "express";

import {
  createBooking,
  getMyBookings,
  getMyBookingById,
  cancelMyBooking,
  getOwnerBookings,
  getOwnerBookingById,
  approveBooking,
  rejectBooking,
} from "../controllers/booking.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Normal User
router.post("/", protect, authorize("user"), createBooking);

router.get("/my", protect, authorize("user"), getMyBookings);

router.get("/my/:id", protect, authorize("user"), getMyBookingById);

router.patch("/my/:id/cancel", protect, authorize("user"), cancelMyBooking);

// Owner
router.get("/owner", protect, authorize("owner"), getOwnerBookings);

router.get("/:id", protect, authorize("owner"), getOwnerBookingById);

router.patch("/:id/approve", protect, authorize("owner"), approveBooking);

router.patch("/:id/reject", protect, authorize("owner"), rejectBooking);

export default router;
