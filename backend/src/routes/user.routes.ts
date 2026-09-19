import { Router } from "express";

import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get("/profile", protect, authorize("user"), getUserProfile);

router.patch("/profile", protect, authorize("user"), updateUserProfile);

router.patch(
  "/profile/password",
  protect,
  authorize("user"),
  changeUserPassword,
);

export default router;
