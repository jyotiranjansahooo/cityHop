import { Router } from "express";

import {
  createCity,
  getAllCities,
  updateCityStatus,
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getAllHostels,
  getHostelById,
  updateHostelStatus,
  getAllBookings,
  getBookingById,
  createArea,
  getAllAreas,
  updateAreaStatus,
  approveAdminBooking,
  rejectAdminBooking,
  cancelAdminBooking,
  updateOwnerStatus,
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
router.get("/hostels/:id", protect, authorize("admin"), getHostelById);

router.post("/cities", protect, authorize("admin"), createCity);
router.get("/cities", protect, authorize("admin"), getAllCities);
router.patch(
  "/cities/:id/status",
  protect,
  authorize("admin"),
  updateCityStatus,
);

router.post("/areas", protect, authorize("admin"), createArea);

router.get("/areas", protect, authorize("admin"), getAllAreas);

router.patch(
  "/areas/:id/status",
  protect,
  authorize("admin"),
  updateAreaStatus,
);
router.patch(
  "/bookings/:id/approve",
  protect,
  authorize("admin"),
  approveAdminBooking,
);
router.patch(
  "/bookings/:id/reject",
  protect,
  authorize("admin"),
  rejectAdminBooking,
);
router.patch(
  "/bookings/:id/cancel",
  protect,
  authorize("admin"),
  cancelAdminBooking,
);
router.patch(
  "/owners/:id/status",
  protect,
  authorize("admin"),
  updateOwnerStatus,
);

export default router;
