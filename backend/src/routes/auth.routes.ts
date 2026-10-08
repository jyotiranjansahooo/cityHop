import { Router } from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { authRateLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, registerUser);

router.post("/login", authRateLimiter, loginUser);

router.get("/me", protect, getCurrentUser);

/* =========================
   USER PROFILE
========================= */

router.get("/user/profile", protect, authorize("user"), getUserProfile);

router.patch("/user/profile", protect, authorize("user"), updateUserProfile);

router.patch(
  "/user/profile/password",
  protect,
  authorize("user"),
  changeUserPassword,
);

export default router;