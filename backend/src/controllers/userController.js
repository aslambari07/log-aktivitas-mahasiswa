import { z } from "zod";

import {
  createUser,
  deleteUser,
  listPublicUsers,
  resetUserPassword,
  updateUser,
} from "../services/sheetsService.js";

const userSchema = z.object({
  nim: z.string().regex(/^\d+$/, "NIM hanya boleh berisi angka."),
  nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi."),
  email: z.string().email("Email tidak valid."),
  username: z.string().min(3, "Username minimal 3 karakter."),
  password: z.string().min(6, "Password minimal 6 karakter.").optional(),
  prodi: z.string().min(1, "Program studi wajib diisi."),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export async function handleListUsers(req, res) {
  const users = await listPublicUsers(req.query);
  res.json(users);
}

export async function handleCreateUser(req, res) {
  const parsed = userSchema.required({ password: true }).parse(req.body);
  const user = await createUser(parsed, req.user.id_admin);
  res.status(201).json(user);
}

export async function handleUpdateUser(req, res) {
  const parsed = userSchema.omit({ password: true }).parse(req.body);
  const user = await updateUser(req.params.id, parsed);
  res.json(user);
}

export async function handleResetPassword(req, res) {
  const parsed = resetPasswordSchema.parse(req.body);
  const result = await resetUserPassword(req.params.id, parsed.password);
  res.json(result);
}

export async function handleDeleteUser(req, res) {
  const result = await deleteUser(req.params.id);
  res.json(result);
}
