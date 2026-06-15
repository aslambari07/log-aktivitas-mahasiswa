import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { authRoutes } from "./routes/authRoutes.js";
import { activityRoutes } from "./routes/activityRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
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
