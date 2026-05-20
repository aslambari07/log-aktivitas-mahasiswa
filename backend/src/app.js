import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { authRoutes } from "./routes/authRoutes.js";
import { activityRoutes } from "./routes/activityRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export const app = express();

const allowedOrigins = env.frontendUrl
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} tidak diizinkan oleh konfigurasi CORS.`));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(env.uploadDir));

app.get("/api/health", (_req, res) => {
  res.json({
    message: "Academic Log API is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use(notFound);
app.use(errorHandler);
