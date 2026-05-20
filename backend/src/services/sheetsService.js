import dayjs from "dayjs";
import { unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { v4 as uuidv4 } from "uuid";

import { env, isAppsScriptConfigured, isGoogleSheetsConfigured } from "../config/env.js";
import { getSheetsClient } from "../config/google.js";
import { appsScriptGet, appsScriptPost } from "./appsScriptService.js";
import { HttpError } from "../utils/httpError.js";
import { getStatusOptions, mapActivityToRow, mapRowToActivity, SHEET_HEADERS } from "../utils/sheets.js";

function ensureDataSourceConfig() {
  if (isAppsScriptConfigured || isGoogleSheetsConfigured) {
    return;
  }

  throw new HttpError(
    500,
    "Sumber data belum dikonfigurasi. Isi GOOGLE_APPS_SCRIPT_URL atau konfigurasi Google Sheets service account di file .env."
  );
}

async function ensureHeaderRow() {
  const sheets = getSheetsClient();
  const range = `${env.sheetName}!A1:I1`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: env.spreadsheetId,
    range,
  });

  const current = response.data.values?.[0] || [];
  const isValid = SHEET_HEADERS.every((header, index) => current[index] === header);

  if (!isValid) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: env.spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [SHEET_HEADERS],
      },
    });
  }
}

async function getAllRows() {
  ensureDataSourceConfig();

  if (isAppsScriptConfigured) {
    const response = await appsScriptGet("list");
    const rows = Array.isArray(response.data) ? response.data : [];
    return rows.map(mapRowToActivity);
  }

  await ensureHeaderRow();

  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: env.spreadsheetId,
    range: `${env.sheetName}!A2:I`,
  });

  const rows = response.data.values || [];
  return rows.map(mapRowToActivity);
}

async function findRowById(id) {
  const rows = await getAllRows();
  const index = rows.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new HttpError(404, "Data aktivitas tidak ditemukan.");
  }

  return {
    activity: rows[index],
    rowNumber: index + 2,
    rows,
  };
}

function filterActivities(rows, query) {
  const search = (query.search || "").trim().toLowerCase();
  const status = (query.status || "").trim();
  const dateFrom = query.dateFrom ? dayjs(query.dateFrom) : null;
  const dateTo = query.dateTo ? dayjs(query.dateTo) : null;

  return rows
    .filter((item) => {
      const searchable = [
        item.nama_mahasiswa,
        item.nim,
        item.jenis_aktivitas,
        item.deskripsi,
      ]
        .join(" ")
        .toLowerCase();

      const activityDate = item.tanggal ? dayjs(item.tanggal) : null;

      const searchMatch = !search || searchable.includes(search);
      const statusMatch = !status || item.status === status;
      const fromMatch = !dateFrom || (activityDate && !activityDate.isBefore(dateFrom, "day"));
      const toMatch = !dateTo || (activityDate && !activityDate.isAfter(dateTo, "day"));

      return searchMatch && statusMatch && fromMatch && toMatch;
    })
    .sort((a, b) => {
      const aDate = dayjs(a.created_at || a.tanggal || 0).valueOf();
      const bDate = dayjs(b.created_at || b.tanggal || 0).valueOf();
      return bDate - aDate;
    });
}

function paginate(rows, page, limit) {
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * limit;

  return {
    items: rows.slice(start, start + limit),
    pagination: {
      page: currentPage,
      limit,
      total,
      totalPages,
    },
  };
}

export async function listActivities(query) {
  const rows = await getAllRows();
  const filtered = filterActivities(rows, query);
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 8);

  return paginate(filtered, page, limit);
}

export async function getActivityById(id) {
  if (isAppsScriptConfigured) {
    const response = await appsScriptGet("getById", { id });
    if (!response.data) {
      throw new HttpError(404, "Data aktivitas tidak ditemukan.");
    }

    return mapRowToActivity(response.data);
  }

  const { activity } = await findRowById(id);
  return activity;
}

export async function createActivity(payload) {
  const now = dayjs().toISOString();
  const activity = {
    id: uuidv4(),
    nama_mahasiswa: payload.nama_mahasiswa,
    nim: payload.nim,
    jenis_aktivitas: payload.jenis_aktivitas,
    deskripsi: payload.deskripsi,
    tanggal: payload.tanggal,
    status: payload.status,
    bukti_file: payload.bukti_file || "",
    created_at: now,
  };

  if (isAppsScriptConfigured) {
    const response = await appsScriptPost("create", { activity });
    return mapRowToActivity(response.data || activity);
  }

  const sheets = getSheetsClient();
  await ensureHeaderRow();
  await sheets.spreadsheets.values.append({
    spreadsheetId: env.spreadsheetId,
    range: `${env.sheetName}!A:I`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [mapActivityToRow(activity)],
    },
  });

  return mapRowToActivity(mapActivityToRow(activity));
}

export async function updateActivity(id, payload) {
  const { activity, rowNumber } = await findRowById(id);
  const nextFile = payload.bukti_file ?? payload.existingBuktiFile ?? "";

  if (payload.bukti_file && activity.bukti_file && activity.bukti_file !== payload.bukti_file) {
    await removeUploadedFile(activity.bukti_file);
  }

  const updated = {
    ...activity,
    nama_mahasiswa: payload.nama_mahasiswa,
    nim: payload.nim,
    jenis_aktivitas: payload.jenis_aktivitas,
    deskripsi: payload.deskripsi,
    tanggal: payload.tanggal,
    status: payload.status,
    bukti_file: nextFile,
  };

  if (isAppsScriptConfigured) {
    const response = await appsScriptPost("update", { id, activity: updated });
    return mapRowToActivity(response.data || updated);
  }

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.spreadsheetId,
    range: `${env.sheetName}!A${rowNumber}:I${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [mapActivityToRow(updated)],
    },
  });

  return mapRowToActivity(mapActivityToRow(updated));
}

export async function deleteActivity(id) {
  const { activity, rowNumber } = await findRowById(id);

  if (isAppsScriptConfigured) {
    await appsScriptPost("delete", { id });

    if (activity.bukti_file) {
      await removeUploadedFile(activity.bukti_file);
    }

    return { id };
  }

  const sheets = getSheetsClient();
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: env.spreadsheetId,
  });

  const sheet = metadata.data.sheets?.find((item) => item.properties?.title === env.sheetName);

  if (!sheet?.properties?.sheetId) {
    throw new HttpError(500, `Sheet ${env.sheetName} tidak ditemukan.`);
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: env.spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheet.properties.sheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });

  if (activity.bukti_file) {
    await removeUploadedFile(activity.bukti_file);
  }

  return { id };
}

export async function getSummary() {
  const rows = await getAllRows();
  const today = dayjs().format("YYYY-MM-DD");
  const groupedByDate = rows.reduce((acc, item) => {
    const dateKey = item.tanggal || "Tanpa tanggal";
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  const groupedByStatus = getStatusOptions().map((status) => ({
    name: status,
    value: rows.filter((item) => item.status === status).length,
  }));

  const groupedByMahasiswa = Object.values(
    rows.reduce((acc, item) => {
      if (!acc[item.nim]) {
        acc[item.nim] = {
          nim: item.nim,
          name: item.nama_mahasiswa,
          total: 0,
        };
      }

      acc[item.nim].total += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return {
    stats: {
      totalAktivitas: rows.length,
      mahasiswaAktif: new Set(rows.map((item) => item.nim).filter(Boolean)).size,
      aktivitasHariIni: rows.filter((item) => item.tanggal === today).length,
      totalLaporan: rows.filter((item) => item.status === "Selesai").length,
    },
    charts: {
      aktivitasPerTanggal: Object.entries(groupedByDate)
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
        .slice(-7),
      aktivitasPerStatus: groupedByStatus,
      aktivitasPerMahasiswa: groupedByMahasiswa,
    },
  };
}

async function removeUploadedFile(filePath) {
  if (!filePath.startsWith("/uploads/")) {
    return;
  }

  const absolutePath = resolve(process.cwd(), filePath.replace("/uploads/", "uploads/"));

  try {
    await unlink(absolutePath);
  } catch {
    // Ignore cleanup issues if the file no longer exists.
  }
}
