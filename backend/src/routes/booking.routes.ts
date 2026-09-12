import { Router } from "express";

import { getOwnerBookings } from "../controllers/booking.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/owner", protect, authorize("owner"), getOwnerBookings);

export default router;
