import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import multer from "multer";

import logger from "../utils/logger.js";

const errorHandler: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        success: false,
        message: "Each image must be 5 MB or smaller",
      });
      return;
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      res.status(400).json({
        success: false,
        message: "Maximum 10 images are allowed",
      });
      return;
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({
        success: false,
        message: "Unexpected file upload",
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: "File upload failed",
    });
    return;
  }

  if (error instanceof Error) {
    if (
      error.message ===
      "Only JPEG, PNG and WebP images are allowed"
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
  }

  logger.error({ error }, "Unhandled server error");

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;

