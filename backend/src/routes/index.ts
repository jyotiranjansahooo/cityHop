import { Router } from "express";
import authRouter from "./auth.routes.js";
import cityRouter from "./city.routes.js";
import hostelRouter from "./hostel.routes.js";
import bookingRouter from "./booking.routes.js";
import ownerRouter from "./owner.routes.js";
import adminRouter from "./admin.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CityHop API is healthy",
  });
});

router.use("/owner", ownerRouter);
router.use("/cities", cityRouter);
router.use("/auth", authRouter);
router.use("/hostels", hostelRouter);
router.use("/bookings", bookingRouter);
router.use("/admin", adminRouter);


export default router;