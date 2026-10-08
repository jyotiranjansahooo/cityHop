import { Router } from "express";

import {
  createBooking,
  getMyBookings,
  getMyBookingById,
  cancelMyBooking,
} from "../controllers/booking.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", protect, authorize("user"), createBooking);

router.get("/my", protect, authorize("user"), getMyBookings);

router.get("/my/:id", protect, authorize("user"), getMyBookingById);

router.patch("/my/:id/cancel", protect, authorize("user"), cancelMyBooking);

export default router;
