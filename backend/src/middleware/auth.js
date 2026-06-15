import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

export const publicAdminUser = {
  id_admin: "public-admin",
  username: "public",
  name: "Publik Admin",
  nama_admin: "Publik Admin",
  role: "admin",
};

export function requireAuth(req, _res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) {
    req.user = publicAdminUser;
    return next();
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    next();
  } catch {
    next(new HttpError(401, "Sesi login tidak valid atau sudah berakhir."));
  }
}

export function requireAdmin(req, _res, next) {
  if (req.user?.role !== "admin") {
    return next(new HttpError(403, "Akses hanya untuk admin."));
  }

  next();
}
