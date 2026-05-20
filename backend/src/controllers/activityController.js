import { z } from "zod";

import {
  createActivity,
  deleteActivity,
  getActivityById,
  getSummary,
  listActivities,
  updateActivity,
} from "../services/sheetsService.js";
import { getStatusOptions } from "../utils/sheets.js";

const payloadSchema = z.object({
  nama_mahasiswa: z.string().min(1, "Nama Mahasiswa wajib diisi."),
  nim: z.string().regex(/^\d+$/, "NIM hanya boleh berisi angka."),
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
    bukti_file: req.file ? `/uploads/${req.file.filename}` : undefined,
  };
}

export async function handleListActivities(req, res) {
  const data = await listActivities(req.query);
  res.json(data);
}

export async function handleGetActivity(req, res) {
  const activity = await getActivityById(req.params.id);
  res.json(activity);
}

export async function handleCreateActivity(req, res) {
  const activity = await createActivity(normalizePayload(req));
  res.status(201).json(activity);
}

export async function handleUpdateActivity(req, res) {
  const activity = await updateActivity(req.params.id, normalizePayload(req));
  res.json(activity);
}

export async function handleDeleteActivity(req, res) {
  const result = await deleteActivity(req.params.id);
  res.json(result);
}

export async function handleSummary(req, res) {
  const summary = await getSummary();
  res.json(summary);
}
