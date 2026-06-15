import { Router } from "express";

import {
  handleCreateUser,
  handleDeleteUser,
  handleListUsers,
  handleResetPassword,
  handleUpdateUser,
} from "../controllers/userController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userRoutes = Router();

userRoutes.use(requireAuth, requireAdmin);
userRoutes.get("/", asyncHandler(handleListUsers));
userRoutes.post("/", asyncHandler(handleCreateUser));
userRoutes.put("/:id", asyncHandler(handleUpdateUser));
userRoutes.patch("/:id/reset-password", asyncHandler(handleResetPassword));
userRoutes.delete("/:id", asyncHandler(handleDeleteUser));
