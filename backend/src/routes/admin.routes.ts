import { Router } from "express";

import {
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getAllHostels,
  updateHostelStatus,
  getAllBookings,
  getBookingById,
} from "../controllers/admin.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/dashboard", protect, authorize("admin"), getAdminDashboard);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.patch(
  "/users/:id/status",
  protect,
  authorize("admin"),
  updateUserStatus,
);
router.get("/hostels", protect, authorize("admin"), getAllHostels);
router.patch(
  "/hostels/:id/status",
  protect,
  authorize("admin"),
  updateHostelStatus,
);
router.get("/bookings", protect, authorize("admin"), getAllBookings);
router.get("/bookings/", protect, authorize("admin"), getBookingById);
router.get("/users/:id", protect, authorize("admin"), getUserById);

export default router;
