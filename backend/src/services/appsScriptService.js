import { env, isAppsScriptConfigured } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

async function parseResponse(response) {
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    const looksLikeGoogleLogin =
      text.includes("accounts.google.com") || text.includes("ServiceLogin");
    const looksLikeDriveError =
      text.includes("Halaman Tidak Ditemukan") || text.includes("tidak dapat membuka file");

    if (looksLikeGoogleLogin || looksLikeDriveError) {
      throw new HttpError(
        502,
        "Apps Script masih private, URL yang dipakai bukan URL /exec publik, atau deployment web app belum benar. Gunakan URL deployment /exec, lalu pastikan Execute as: Me dan Who has access: Anyone."
      );
    }

    throw new HttpError(502, "Response dari Google Apps Script bukan JSON yang valid.");
  }

  if (!response.ok || data?.success === false) {
    throw new HttpError(502, data?.message || "Google Apps Script gagal memproses request.");
  }

  return data;
}

function ensureAppsScriptConfig() {
  if (!isAppsScriptConfigured) {
    throw new HttpError(
      500,
      "Google Apps Script belum dikonfigurasi. Isi GOOGLE_APPS_SCRIPT_URL di file .env."
    );
  }
}

export async function appsScriptGet(action, params = {}) {
  ensureAppsScriptConfig();

  const query = new URLSearchParams({
    action,
    spreadsheetName: env.spreadsheetName,
    sheetName: env.sheetName,
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value ?? "")])
    ),
  });

  const response = await fetch(`${env.appsScriptUrl}?${query.toString()}`);
  return parseResponse(response);
}

export async function appsScriptPost(action, payload = {}) {
  ensureAppsScriptConfig();

  const response = await fetch(env.appsScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action,
      spreadsheetName: env.spreadsheetName,
      sheetName: env.sheetName,
      ...payload,
    }),
  });

  return parseResponse(response);
}
