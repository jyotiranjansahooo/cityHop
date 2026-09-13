import { Router } from "express";

import { getOwnerDashboard } from "../controllers/owner.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  getOwnerProfile,
  updateOwnerProfile,
  changeOwnerPassword,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/dashboard", protect, authorize("owner"), getOwnerDashboard);
router.get("/profile", protect, authorize("owner"), getOwnerProfile);
router.put("/profile", protect, authorize("owner"), updateOwnerProfile);
router.patch(
  "/profile/password",
  protect,
  authorize("owner"),
  changeOwnerPassword,
);

export default router;
