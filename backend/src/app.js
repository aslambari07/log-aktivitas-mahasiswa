import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { authRoutes } from "./routes/authRoutes.js";
import { activityRoutes } from "./routes/activityRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export const app = express();

function normalizeOrigin(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed;
  }
}

const allowedOrigins = env.frontendUrl
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

function isLocalhostOrigin(origin) {
  try {
    const { hostname } = new URL(origin);
    return ["localhost", "127.0.0.1", "::1"].includes(hostname);
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin) ||
        isLocalhostOrigin(origin)
      ) {
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
app.use("/api/users", userRoutes);
app.use(notFound);
app.use(errorHandler);
