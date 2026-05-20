import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi."),
  password: z.string().min(1, "Password wajib diisi."),
});

export async function login(req, res) {
  const credentials = loginSchema.parse(req.body);

  if (
    credentials.username !== env.loginUsername ||
    credentials.password !== env.loginPassword
  ) {
    throw new HttpError(401, "Username atau password tidak valid.");
  }

  const user = {
    username: env.loginUsername,
    name: "Admin Akademik",
  };

  const token = jwt.sign(user, env.jwtSecret, { expiresIn: "1d" });

  res.json({
    token,
    user,
  });
}

export async function me(req, res) {
  res.json({
    user: req.user,
  });
}
