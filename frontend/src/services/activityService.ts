import { http } from "../api/http";
import type { Activity, ActivityFormValues, ActivityListResponse, SummaryResponse } from "../types";

export async function fetchActivities(params: Record<string, string | number>) {
  const { data } = await http.get<ActivityListResponse>("/api/activities", { params });
  return data;
}

export async function fetchSummary() {
  const { data } = await http.get<SummaryResponse>("/api/activities/summary");
  return data;
}

function toFormData(payload: ActivityFormValues) {
  const formData = new FormData();
  formData.append("nama_mahasiswa", payload.nama_mahasiswa);
  formData.append("nim", payload.nim);
  formData.append("jenis_aktivitas", payload.jenis_aktivitas);
  formData.append("deskripsi", payload.deskripsi);
  formData.append("tanggal", payload.tanggal);
  formData.append("status", payload.status);

  if (payload.existingBuktiFile) {
    formData.append("existingBuktiFile", payload.existingBuktiFile);
  }

  const file = payload.bukti_file?.[0];
  if (file) {
    formData.append("bukti_file", file);
  }

  return formData;
}

export async function createActivity(payload: ActivityFormValues) {
  const { data } = await http.post<Activity>("/api/activities", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateActivity(id: string, payload: ActivityFormValues) {
  const { data } = await http.put<Activity>(`/api/activities/${id}`, toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function removeActivity(id: string) {
  const { data } = await http.delete<{ id: string }>(`/api/activities/${id}`);
  return data;
}
