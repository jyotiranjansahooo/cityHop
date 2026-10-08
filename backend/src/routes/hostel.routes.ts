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

router.get("/", getHostels);

router.get("/:id", getHostelById);

router.post("/", protect, authorize("user", "admin"), createHostel);

router.patch("/:id", protect, authorize("user", "admin"), updateHostel);

// Deactivate hostel
router.delete("/:id", protect, authorize("user", "admin"), deleteHostel);

router.post(
  "/:id/images",
  protect,
  authorize("user", "admin"),
  upload.array("images", 10),
  uploadHostelImages,
);

router.delete(
  "/:id/images/:imageId",
  protect,
  authorize("user", "admin"),
  deleteHostelImage,
);

export default router;
