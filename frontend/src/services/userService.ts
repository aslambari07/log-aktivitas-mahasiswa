import { http } from "../api/http";
import type { User, UserFormValues } from "../types";

export async function fetchUsers(params: Record<string, string | number> = {}) {
  const { data } = await http.get<User[]>("/api/users", { params });
  return data;
}

export async function createUser(payload: UserFormValues) {
  const { data } = await http.post<User>("/api/users", payload);
  return data;
}

export async function updateUser(id: string, payload: Omit<UserFormValues, "password">) {
  const { data } = await http.put<User>(`/api/users/${id}`, payload);
  return data;
}

export async function resetUserPassword(id: string, password: string) {
  const { data } = await http.patch<{ id_user: string }>(`/api/users/${id}/reset-password`, { password });
  return data;
}

export async function removeUser(id: string) {
  const { data } = await http.delete<{ id_user: string }>(`/api/users/${id}`);
  return data;
}
