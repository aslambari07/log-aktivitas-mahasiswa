import { http } from "../api/http";
import type { AuthResponse } from "../types";

export async function login(payload: { username: string; password: string }) {
  const { data } = await http.post<AuthResponse>("/api/auth/login", payload);
  return data;
}

export async function getProfile() {
  const { data } = await http.get<{ user: { username: string; name: string } }>("/api/auth/me");
  return data.user;
}
