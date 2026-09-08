import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import apiRouter from "./routes/index.js";
import logger from "./utils/logger.js";

dotenv.config();

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

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to CityHop API",
  });
});

app.use("/api", apiRouter);

io.on("connection", (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const PORT = Number(process.env.PORT) || 5000;

    httpServer.on("error", (error) => {
      logger.error({ error }, "Server failed to start");
      process.exit(1);
    });

    httpServer.listen(PORT, () => {
      logger.info(`CityHop API running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ error }, "Failed to start server");
    process.exit(1);
  }
};

startServer();
