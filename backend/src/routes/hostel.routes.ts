import { Router } from "express";

import { createHostel } from "../controllers/hostel.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import hostelRouter from "./hostel.routes.js";
import authRouter from "./auth.routes.js";



const router = Router();

router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  createHostel,
);
router.use("/auth", authRouter);
router.use("/hostels", hostelRouter);

export default router;