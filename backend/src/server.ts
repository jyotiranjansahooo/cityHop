import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import { apiRateLimiter } from "./middleware/rate-limit.middleware.js";
import errorHandler from "./middleware/error.middleware.js";
import connectDB from "./config/db.js";
import apiRouter from "./routes/index.js";
import logger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.use(helmet());

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to CityHop API",
  });
});

app.use("/api", apiRateLimiter);
app.use("/api", apiRouter);

app.use(errorHandler);

io.on("connection", (socket) => {
  logger.info({ socketId: socket.id }, "Socket connected");

  socket.on("disconnect", () => {
    logger.info({ socketId: socket.id }, "Socket disconnected");
  });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const PORT = Number(process.env.PORT) || 5000;

    httpServer.listen(PORT, () => {
      logger.info({ port: PORT }, "CityHop API running");
    });
  } catch (error) {
    logger.error({ error }, "Server failed to start");
    process.exit(1);
  }
};

startServer();
