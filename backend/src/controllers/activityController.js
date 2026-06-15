import { z } from "zod";

import {
  createActivity,
  deleteActivity,
  getActivityById,
  getSummary,
  listActivities,
  updateActivity,
  verifyActivity,
} from "../services/sheetsService.js";
import { getStatusOptions } from "../utils/sheets.js";

const payloadSchema = z.object({
  id_user: z.string().optional(),
  judul_kegiatan: z.string().optional(),
  jenis_aktivitas: z.string().min(1, "Jenis Aktivitas wajib diisi."),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi."),
  tanggal: z.string().min(1, "Tanggal wajib diisi."),
  status: z.enum(getStatusOptions(), {
    error: "Status tidak valid.",
  }),
  existingBuktiFile: z.string().optional(),
});

function normalizePayload(req) {
  const parsed = payloadSchema.parse(req.body);
  return {
    ...parsed,
    judul_kegiatan: parsed.judul_kegiatan || parsed.jenis_aktivitas,
    bukti_file: req.file ? `/uploads/${req.file.filename}` : undefined,
  };
}

export async function handleListActivities(req, res) {
  const data = await listActivities(req.query, req.user);
  res.json(data);
}

export async function handleGetActivity(req, res) {
  const activity = await getActivityById(req.params.id, req.user);
  res.json(activity);
}

export async function handleCreateActivity(req, res) {
  const activity = await createActivity(normalizePayload(req), req.user);
  res.status(201).json(activity);
}

export async function handleUpdateActivity(req, res) {
  const activity = await updateActivity(req.params.id, normalizePayload(req), req.user);
  res.json(activity);
}

export async function handleVerifyActivity(req, res) {
  const parsed = z.object({ status: z.enum(getStatusOptions()) }).parse(req.body);
  const activity = await verifyActivity(req.params.id, parsed.status);
  res.json(activity);
}

export async function handleDeleteActivity(req, res) {
  const result = await deleteActivity(req.params.id, req.user);
  res.json(result);
}

export async function handleSummary(req, res) {
  const summary = await getSummary(req.user);
  res.json(summary);
}
