import { Router } from "express";

import {
  getOwnerBookings,
  getOwnerBookingById,
  approveBooking,
  rejectBooking,
} from "../controllers/booking.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/owner", protect, authorize("owner"), getOwnerBookings);

router.get("/:id", protect, authorize("owner"), getOwnerBookingById);

router.patch("/:id/approve", protect, authorize("owner"), approveBooking);

router.patch("/:id/reject", protect, authorize("owner"), rejectBooking);


export default router;
