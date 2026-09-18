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

// Public
router.get("/", getHostels);
router.get("/:id", getHostelById);

// Owner
router.post("/", protect, authorize("owner"), createHostel);

router.patch("/:id", protect, authorize("owner"), updateHostel);

router.delete("/:id", protect, authorize("owner"), deleteHostel);

router.post(
  "/:id/images",
  protect,
  authorize("owner"),
  upload.array("images", 10),
  uploadHostelImages,
);

router.delete(
  "/:id/images/:publicId",
  protect,
  authorize("owner"),
  deleteHostelImage,
);

export default router;
