import { Router } from "express";
import authRouter from "./auth.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CityHop API is healthy",
  });
});

router.use("/auth", authRouter);

export default router;