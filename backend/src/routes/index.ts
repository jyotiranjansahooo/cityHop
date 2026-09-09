import { Router } from "express";
import authRouter from "./auth.routes.js";
import cityRouter from "./city.routes.js";
import hostelRouter from "./hostel.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CityHop API is healthy",
  });
});
router.use("/cities", cityRouter);
router.use("/auth", authRouter);
router.use("/hostels", hostelRouter);


export default router;