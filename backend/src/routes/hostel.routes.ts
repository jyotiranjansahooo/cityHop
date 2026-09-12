import { Router } from "express";

import {
createHostel,
deleteHostel,
getHostelById,
getHostels,
updateHostel,
uploadHostelImages,
} from "../controllers/hostel.controller.js";
import upload from "../middleware/upload.middleware.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", getHostels);

router.get("/:id", getHostelById);

router.post("/", protect, authorize("owner", "admin"), createHostel);

router.patch("/:id", protect, authorize("owner", "admin"), updateHostel);

router.delete("/:id", protect, authorize("owner", "admin"), deleteHostel);
router.post(
  "/upload-images",
  protect,
  authorize("owner", "admin"),
  upload.array("images", 10),
  uploadHostelImages,
);
router.post(
  "/:id/images",
  protect,
  authorize("owner", "admin"),
  upload.array("images", 10),
  uploadHostelImages,
);

router.delete(
  "/:id/images/:publicId",
  protect,
  authorize("owner", "admin"),
  uploadHostelImages,
);

export default router;
