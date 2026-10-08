import { Router } from "express";

import {
  getAdminDashboard,
  getAllUsers,
  updateUserStatus,
  getAllHostels,
  updateHostelStatus,
  getAllBookings,
  updateBookingStatus,
  getAllCities,
  createCity,
  updateCity,
  getAllAreas,
  createArea,
  updateArea,
  deleteArea,
} from "../controllers/admin.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

/* =========================
   ADMIN DASHBOARD
========================= */

router.get("/dashboard", protect, authorize("admin"), getAdminDashboard);

/* =========================
   USERS
========================= */

router.get("/users", protect, authorize("admin"), getAllUsers);

router.patch(
  "/users/:id/status",
  protect,
  authorize("admin"),
  updateUserStatus,
);

/* =========================
   HOSTELS
========================= */

router.get("/hostels", protect, authorize("admin"), getAllHostels);

router.patch(
  "/hostels/:id/status",
  protect,
  authorize("admin"),
  updateHostelStatus,
);

/* =========================
   BOOKINGS
========================= */

router.get("/bookings", protect, authorize("admin"), getAllBookings);

router.patch(
  "/bookings/:id/status",
  protect,
  authorize("admin"),
  updateBookingStatus,
);

/* =========================
   CITIES
========================= */

router.get("/cities", protect, authorize("admin"), getAllCities);

router.post("/cities", protect, authorize("admin"), createCity);

router.patch("/cities/:id", protect, authorize("admin"), updateCity);

/* =========================
   AREAS
========================= */

router.get("/areas", protect, authorize("admin"), getAllAreas);

router.post("/areas", protect, authorize("admin"), createArea);

router.patch("/areas/:id", protect, authorize("admin"), updateArea);

router.delete("/areas/:id", protect, authorize("admin"), deleteArea);

export default router;
