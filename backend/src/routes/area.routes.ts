import { Router } from "express";

import { createArea, getAreasByCity } from "../controllers/area.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get("/city/:cityId", getAreasByCity);

router.post("/", protect, authorize("admin"), createArea);

export default router;
