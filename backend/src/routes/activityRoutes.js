import { Router } from "express";

import {
  handleCreateActivity,
  handleDeleteActivity,
  handleGetActivity,
  handleListActivities,
  handleSummary,
  handleUpdateActivity,
} from "../controllers/activityController.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const activityRoutes = Router();

activityRoutes.use(requireAuth);
activityRoutes.get("/", asyncHandler(handleListActivities));
activityRoutes.get("/summary", asyncHandler(handleSummary));
activityRoutes.get("/:id", asyncHandler(handleGetActivity));
activityRoutes.post("/", upload.single("bukti_file"), asyncHandler(handleCreateActivity));
activityRoutes.put("/:id", upload.single("bukti_file"), asyncHandler(handleUpdateActivity));
activityRoutes.delete("/:id", asyncHandler(handleDeleteActivity));
