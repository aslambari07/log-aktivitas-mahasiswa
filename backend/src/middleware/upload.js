import multer from "multer";
import { mkdirSync } from "node:fs";
import { extname } from "node:path";
import { randomUUID } from "node:crypto";

import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: env.uploadDir,
  filename: (_req, file, callback) => {
    callback(null, `${Date.now()}-${randomUUID()}${extname(file.originalname)}`);
  },
});

function fileFilter(_req, file, callback) {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf", ".webp"];
  const extension = extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    callback(new HttpError(400, "Format file harus PNG, JPG, WEBP, atau PDF."));
    return;
  }

  callback(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxUploadMb * 1024 * 1024,
  },
});
