import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "../config/env.js";
import { publicAdminUser } from "../middleware/auth.js";
import { findAccountByCredentials } from "../services/sheetsService.js";
import { HttpError } from "../utils/httpError.js";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi."),
  password: z.string().min(1, "Password wajib diisi."),
});

export async function login(req, res) {
  const credentials = loginSchema.parse(req.body);
  const user = await findAccountByCredentials(credentials.username, credentials.password);

  if (!user) {
    throw new HttpError(401, "Username atau password tidak valid.");
  }

  const token = jwt.sign(user, env.jwtSecret, { expiresIn: "1d" });

  res.json({
    token,
    user,
  });
}

export async function me(req, res) {
  res.json({
    user: req.user || publicAdminUser,
  });
}
