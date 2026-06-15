import dayjs from "dayjs";
import { unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { v4 as uuidv4 } from "uuid";

import { env, isAppsScriptConfigured, isGoogleSheetsConfigured } from "../config/env.js";
import { getSheetsClient } from "../config/google.js";
import { appsScriptGet, appsScriptPost } from "./appsScriptService.js";
import { HttpError } from "../utils/httpError.js";
import {
  ACTIVITY_HEADERS,
  ADMIN_HEADERS,
  SHEET_NAMES,
  USER_HEADERS,
  getStatusOptions,
  mapActivityToRow,
  mapAdminToRow,
  mapRowToActivity,
  mapRowToAdmin,
  mapRowToUser,
  mapUserToRow,
  publicAdmin,
  publicUser,
} from "../utils/sheets.js";

function ensureDataSourceConfig() {
  if (isAppsScriptConfigured || isGoogleSheetsConfigured) {
    return;
  }

  throw new HttpError(
    500,
    "Sumber data belum dikonfigurasi. Isi GOOGLE_APPS_SCRIPT_URL atau konfigurasi Google Sheets service account di file .env."
  );
}

async function getSheetMetadata(sheetName) {
  const sheets = getSheetsClient();
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId: env.spreadsheetId,
  });

  return metadata.data.sheets?.find((item) => item.properties?.title === sheetName) || null;
}

async function ensureSheet(sheetName, headers) {
  const sheets = getSheetsClient();
  let sheet = await getSheetMetadata(sheetName);

  if (!sheet) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: env.spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
                gridProperties: { rowCount: 1000, columnCount: headers.length },
              },
            },
          },
        ],
      },
    });
    sheet = await getSheetMetadata(sheetName);
  }

  const range = `${sheetName}!A1:${columnLetter(headers.length)}1`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: env.spreadsheetId,
    range,
  });
  const current = response.data.values?.[0] || [];
  const isValid = headers.every((header, index) => current[index] === header);

  if (!isValid) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: env.spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [headers],
      },
    });
  }

  return sheet;
}

async function getRows(sheetName, headers, mapper) {
  ensureDataSourceConfig();

  if (isAppsScriptConfigured) {
    const response = await appsScriptGet("listRows", { sheetName });
    const rows = Array.isArray(response.data) ? response.data : [];
    return rows.map(mapper);
  }

  await ensureSheet(sheetName, headers);
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: env.spreadsheetId,
    range: `${sheetName}!A2:${columnLetter(headers.length)}`,
  });

  return (response.data.values || []).map(mapper);
}

async function appendRow(sheetName, headers, values) {
  if (isAppsScriptConfigured) {
    const response = await appsScriptPost("appendRow", { sheetName, values });
    return response.data;
  }

  const sheets = getSheetsClient();
  await ensureSheet(sheetName, headers);
  await sheets.spreadsheets.values.append({
    spreadsheetId: env.spreadsheetId,
    range: `${sheetName}!A:${columnLetter(headers.length)}`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });

  return values;
}

async function updateRow(sheetName, headers, rowNumber, values) {
  if (isAppsScriptConfigured) {
    const response = await appsScriptPost("updateRow", { sheetName, rowNumber, values });
    return response.data;
  }

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: env.spreadsheetId,
    range: `${sheetName}!A${rowNumber}:${columnLetter(headers.length)}${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [values] },
  });

  return values;
}

async function deleteRow(sheetName, rowNumber) {
  if (isAppsScriptConfigured) {
    await appsScriptPost("deleteRow", { sheetName, rowNumber });
    return;
  }

  const sheet = await getSheetMetadata(sheetName);
  const sheetId = sheet?.properties?.sheetId;

  if (sheetId == null) {
    throw new HttpError(500, `Sheet ${sheetName} tidak ditemukan.`);
  }

  const sheets = getSheetsClient();
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: env.spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  });
}

async function findRowById(sheetName, headers, rows, key, id) {
  const index = rows.findIndex((item) => String(item[key]) === String(id));

  if (index === -1) {
    return null;
  }

  return {
    item: rows[index],
    rowNumber: index + 2,
  };
}

export async function listAdmins() {
  return getRows(SHEET_NAMES.admin, ADMIN_HEADERS, mapRowToAdmin);
}

export async function listUsers() {
  return getRows(SHEET_NAMES.user, USER_HEADERS, mapRowToUser);
}

export async function findAccountByCredentials(username, password) {
  const admins = await listAdmins();
  const admin = admins.find(
    (item) => item.username === username && item.password === password
  );

  if (admin) {
    return publicAdmin(admin);
  }

  const users = await listUsers();
  const user = users.find((item) => item.username === username && item.password === password);

  if (user) {
    return publicUser(user);
  }

  return null;
}

export async function listPublicUsers(query = {}) {
  const users = await listUsers();
  const search = (query.search || "").trim().toLowerCase();

  return users
    .filter((user) => {
      const searchable = [user.nim, user.nama_lengkap, user.email, user.username, user.prodi]
        .join(" ")
        .toLowerCase();
      return !search || searchable.includes(search);
    })
    .map(publicUser)
    .sort((a, b) => a.nama_lengkap.localeCompare(b.nama_lengkap));
}

export async function createUser(payload, adminId) {
  const users = await listUsers();
  const duplicate = users.find(
    (user) =>
      user.username === payload.username ||
      user.email === payload.email ||
      user.nim === payload.nim
  );

  if (duplicate) {
    throw new HttpError(409, "NIM, email, atau username sudah digunakan.");
  }

  const now = dayjs().toISOString();
  const user = {
    id_user: uuidv4(),
    id_admin: adminId,
    nim: payload.nim,
    nama_lengkap: payload.nama_lengkap,
    email: payload.email,
    username: payload.username,
    password: payload.password,
    prodi: payload.prodi,
    created_at: now,
  };

  await appendRow(SHEET_NAMES.user, USER_HEADERS, mapUserToRow(user));
  return publicUser(user);
}

export async function updateUser(id, payload) {
  const users = await listUsers();
  const found = await findRowById(SHEET_NAMES.user, USER_HEADERS, users, "id_user", id);

  if (!found) {
    throw new HttpError(404, "Data user tidak ditemukan.");
  }

  const duplicate = users.find(
    (user) =>
      user.id_user !== id &&
      (user.username === payload.username || user.email === payload.email || user.nim === payload.nim)
  );

  if (duplicate) {
    throw new HttpError(409, "NIM, email, atau username sudah digunakan.");
  }

  const updated = {
    ...found.item,
    nim: payload.nim,
    nama_lengkap: payload.nama_lengkap,
    email: payload.email,
    username: payload.username,
    prodi: payload.prodi,
  };

  await updateRow(SHEET_NAMES.user, USER_HEADERS, found.rowNumber, mapUserToRow(updated));
  return publicUser(updated);
}

export async function resetUserPassword(id, password) {
  const users = await listUsers();
  const found = await findRowById(SHEET_NAMES.user, USER_HEADERS, users, "id_user", id);

  if (!found) {
    throw new HttpError(404, "Data user tidak ditemukan.");
  }

  const updated = { ...found.item, password };
  await updateRow(SHEET_NAMES.user, USER_HEADERS, found.rowNumber, mapUserToRow(updated));
  return { id_user: id };
}

export async function deleteUser(id) {
  const users = await listUsers();
  const found = await findRowById(SHEET_NAMES.user, USER_HEADERS, users, "id_user", id);

  if (!found) {
    throw new HttpError(404, "Data user tidak ditemukan.");
  }

  const activities = await getAllActivityRows();
  const hasActivities = activities.some((activity) => activity.id_user === id);

  if (hasActivities) {
    throw new HttpError(409, "User masih memiliki log aktivitas. Hapus atau pindahkan log terlebih dahulu.");
  }

  await deleteRow(SHEET_NAMES.user, found.rowNumber);
  return { id_user: id };
}

async function getAllActivityRows() {
  return getRows(SHEET_NAMES.activity, ACTIVITY_HEADERS, (row) => mapRowToActivity(row));
}

async function getJoinedActivities() {
  const [activities, users] = await Promise.all([getAllActivityRows(), listUsers()]);
  const usersById = new Map(users.map((user) => [user.id_user, user]));
  return activities.map((activity) => mapRowToActivity(activity, usersById.get(activity.id_user)));
}

function filterActivities(rows, query, authUser) {
  const search = (query.search || "").trim().toLowerCase();
  const status = (query.status || "").trim();
  const dateFrom = query.dateFrom ? dayjs(query.dateFrom) : null;
  const dateTo = query.dateTo ? dayjs(query.dateTo) : null;

  return rows
    .filter((item) => {
      if (authUser?.role === "user" && item.id_user !== authUser.id_user) {
        return false;
      }

      const searchable = [
        item.judul_kegiatan,
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

export async function listActivities(query, authUser) {
  const rows = await getJoinedActivities();
  const filtered = filterActivities(rows, query, authUser);
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 8);

  return paginate(filtered, page, limit);
}

export async function getActivityById(id, authUser) {
  const rows = await getJoinedActivities();
  const activity = rows.find((item) => item.id_log === id);

  if (!activity) {
    throw new HttpError(404, "Data aktivitas tidak ditemukan.");
  }

  assertActivityAccess(activity, authUser);
  return activity;
}

export async function createActivity(payload, authUser) {
  const now = dayjs().toISOString();
  const userId = authUser.role === "admin" ? payload.id_user : authUser.id_user;
  const user = (await listUsers()).find((item) => item.id_user === userId);

  if (!user) {
    throw new HttpError(404, "User pemilik aktivitas tidak ditemukan.");
  }

  const activity = {
    id_log: uuidv4(),
    id_user: userId,
    judul_kegiatan: payload.judul_kegiatan,
    jenis_aktivitas: payload.jenis_aktivitas,
    deskripsi: payload.deskripsi,
    tanggal: payload.tanggal,
    status: authUser.role === "admin" ? payload.status : "pending",
    bukti_file: payload.bukti_file || "",
    created_at: now,
  };

  await appendRow(SHEET_NAMES.activity, ACTIVITY_HEADERS, mapActivityToRow(activity));
  return mapRowToActivity(activity, user);
}

export async function updateActivity(id, payload, authUser) {
  const rows = await getAllActivityRows();
  const found = await findRowById(SHEET_NAMES.activity, ACTIVITY_HEADERS, rows, "id_log", id);

  if (!found) {
    throw new HttpError(404, "Data aktivitas tidak ditemukan.");
  }

  assertActivityAccess(found.item, authUser);

  const nextFile = payload.bukti_file ?? payload.existingBuktiFile ?? "";
  if (payload.bukti_file && found.item.bukti_file && found.item.bukti_file !== payload.bukti_file) {
    await removeUploadedFile(found.item.bukti_file);
  }

  const nextUserId = authUser.role === "admin" && payload.id_user ? payload.id_user : found.item.id_user;
  const users = await listUsers();
  const user = users.find((item) => item.id_user === nextUserId);

  if (!user) {
    throw new HttpError(404, "User pemilik aktivitas tidak ditemukan.");
  }

  const updated = {
    ...found.item,
    id_user: nextUserId,
    judul_kegiatan: payload.judul_kegiatan,
    jenis_aktivitas: payload.jenis_aktivitas,
    deskripsi: payload.deskripsi,
    tanggal: payload.tanggal,
    status: authUser.role === "admin" ? payload.status : found.item.status,
    bukti_file: nextFile,
  };

  await updateRow(SHEET_NAMES.activity, ACTIVITY_HEADERS, found.rowNumber, mapActivityToRow(updated));
  return mapRowToActivity(updated, user);
}

export async function verifyActivity(id, status) {
  if (!getStatusOptions().includes(status)) {
    throw new HttpError(400, "Status tidak valid.");
  }

  const rows = await getAllActivityRows();
  const found = await findRowById(SHEET_NAMES.activity, ACTIVITY_HEADERS, rows, "id_log", id);

  if (!found) {
    throw new HttpError(404, "Data aktivitas tidak ditemukan.");
  }

  const updated = { ...found.item, status };
  await updateRow(SHEET_NAMES.activity, ACTIVITY_HEADERS, found.rowNumber, mapActivityToRow(updated));
  return mapRowToActivity(updated, (await listUsers()).find((user) => user.id_user === updated.id_user));
}

export async function deleteActivity(id, authUser) {
  const rows = await getAllActivityRows();
  const found = await findRowById(SHEET_NAMES.activity, ACTIVITY_HEADERS, rows, "id_log", id);

  if (!found) {
    throw new HttpError(404, "Data aktivitas tidak ditemukan.");
  }

  assertActivityAccess(found.item, authUser);
  await deleteRow(SHEET_NAMES.activity, found.rowNumber);

  if (found.item.bukti_file) {
    await removeUploadedFile(found.item.bukti_file);
  }

  return { id: found.item.id_log };
}

export async function getSummary(authUser) {
  const rows = filterActivities(await getJoinedActivities(), {}, authUser);
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
      const key = item.id_user || item.nim;
      if (!acc[key]) {
        acc[key] = {
          nim: item.nim,
          name: item.nama_mahasiswa,
          total: 0,
        };
      }

      acc[key].total += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return {
    stats: {
      totalAktivitas: rows.length,
      mahasiswaAktif: new Set(rows.map((item) => item.id_user).filter(Boolean)).size,
      aktivitasHariIni: rows.filter((item) => item.tanggal === today).length,
      totalLaporan: rows.filter((item) => item.status === "approved").length,
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

function assertActivityAccess(activity, authUser) {
  if (authUser?.role === "user" && activity.id_user !== authUser.id_user) {
    throw new HttpError(403, "Anda tidak memiliki akses ke aktivitas ini.");
  }
}

function columnLetter(columnNumber) {
  let letter = "";
  let number = columnNumber;

  while (number > 0) {
    const remainder = (number - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    number = Math.floor((number - 1) / 26);
  }

  return letter;
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
