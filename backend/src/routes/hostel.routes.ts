import { Router } from "express";

import {
  createHostel,
  getHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
  uploadHostelImages,
  deleteHostelImage,
} from "../controllers/hostel.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

/*

* Public routes
  */

// Get all active hostels with filters
router.get("/", getHostels);

// Get a single active hostel
router.get("/:id", getHostelById);

/*

* Owner routes
  */

// Create hostel
router.post("/", protect, authorize("owner"), createHostel);

// Update hostel
router.patch("/:id", protect, authorize("owner"), updateHostel);

// Deactivate hostel
router.delete("/:id", protect, authorize("owner"), deleteHostel);

/*

* Hostel image routes
  */

// Upload hostel images
router.post(
  "/:id/images",
  protect,
  authorize("owner"),
  upload.array("images", 10),
  uploadHostelImages,
);

// Delete a hostel image
router.delete(
  "/:id/images",
  protect,
  authorize("owner", "admin"),
  deleteHostelImage,
);

export default router;
