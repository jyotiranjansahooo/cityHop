import { Router } from "express";

import {
  createCity,
  getCities,
} from "../controllers/city.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", getCities);

router.post(
  "/",
  protect,
  authorize("admin"),
  createCity,
);

export default router;