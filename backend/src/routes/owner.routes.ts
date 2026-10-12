import { Router } from "express";

const router = Router();

router.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Owner routes are currently unavailable",
  });
});

export default router;