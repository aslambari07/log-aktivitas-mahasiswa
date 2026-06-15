const SHEET_HEADERS = {
  tb_admin: ["id_admin", "nama_admin", "email", "username", "password", "created_at"],
  tb_user: [
    "id_user",
    "id_admin",
    "nim",
    "nama_lengkap",
    "email",
    "username",
    "password",
    "prodi",
    "created_at",
  ],
  log_aktivitas: [
    "id_log",
    "id_user",
    "judul_kegiatan",
    "jenis_aktivitas",
    "deskripsi",
    "tanggal",
    "status",
    "bukti_file",
    "created_at",
  ],
};

const DEFAULT_ADMIN = {
  id_admin: "ADM001",
  nama_admin: "Admin Akademik",
  email: "admin@email.com",
  username: "admin",
  password: "admin123",
};

function doGet(e) {
  try {
    const action = (e.parameter.action || "listRows").trim();
    const sheetName = e.parameter.sheetName || "log_aktivitas";
    const sheet = prepareSheet(sheetName);
    const headers = getHeaders(sheetName);

    if (action === "listRows" || action === "list") {
      return jsonResponse({
        success: true,
        data: getAllRows(sheet, headers),
      });
    }

    if (action === "getById") {
      const key = getIdKey(sheetName);
      const row =
        getAllRows(sheet, headers).find(function (item) {
          return String(item[key]) === String(e.parameter.id);
        }) || null;

      return jsonResponse({
        success: true,
        data: row,
      });
    }

    return jsonResponse({
      success: false,
      message: "Action GET tidak dikenali.",
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message,
    });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || "{}");
    const action = body.action;
    const sheetName = body.sheetName || "log_aktivitas";
    const sheet = prepareSheet(sheetName);
    const headers = getHeaders(sheetName);

    if (action === "appendRow") {
      const values = normalizeValues(body.values || [], headers);
      sheet.appendRow(values);
      return jsonResponse({ success: true, data: values });
    }

    if (action === "updateRow") {
      const rowNumber = Number(body.rowNumber);
      if (!rowNumber || rowNumber < 2) {
        throw new Error("Nomor baris tidak valid.");
      }

      const values = normalizeValues(body.values || [], headers);
      sheet.getRange(rowNumber, 1, 1, headers.length).setValues([values]);
      return jsonResponse({ success: true, data: values });
    }

    if (action === "deleteRow") {
      const rowNumber = Number(body.rowNumber);
      if (!rowNumber || rowNumber < 2) {
        throw new Error("Nomor baris tidak valid.");
      }

      sheet.deleteRow(rowNumber);
      return jsonResponse({ success: true, data: { rowNumber: rowNumber } });
    }

    if (action === "create") {
      const record = normalizeRecord(body.data || body.activity || body.user || body.admin || {}, headers);
      const idKey = getIdKey(sheetName);

      if (!record[idKey]) {
        record[idKey] = Utilities.getUuid();
      }

      if (sheetName === "log_aktivitas" && !record.status) {
        record.status = "pending";
      }

      if (!record.created_at) {
        record.created_at = new Date().toISOString();
      }

      sheet.appendRow(toRow(record, headers));
      return jsonResponse({ success: true, data: record });
    }

    if (action === "update") {
      const idKey = getIdKey(sheetName);
      const id = body.id || (body.data && body.data[idKey]) || (body.activity && body.activity[idKey]);
      const rowIndex = findRowIndexById(sheet, headers, sheetName, id);

      if (rowIndex === -1) {
        throw new Error("Data tidak ditemukan.");
      }

      const current = getRecordByRow(sheet, headers, rowIndex);
      const record = Object.assign(
        {},
        current,
        normalizeRecord(body.data || body.activity || body.user || body.admin || {}, headers)
      );
      record[idKey] = record[idKey] || id;
      record.created_at = record.created_at || current.created_at || new Date().toISOString();

      sheet.getRange(rowIndex, 1, 1, headers.length).setValues([toRow(record, headers)]);
      return jsonResponse({ success: true, data: record });
    }

    if (action === "delete") {
      const rowIndex = findRowIndexById(sheet, headers, sheetName, body.id);

      if (rowIndex === -1) {
        throw new Error("Data tidak ditemukan.");
      }

      sheet.deleteRow(rowIndex);
      return jsonResponse({ success: true, data: { id: body.id } });
    }

    return jsonResponse({
      success: false,
      message: "Action POST tidak dikenali.",
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message,
    });
  }
}

function prepareSheet(sheetName) {
  const sheet = getSheet(sheetName);
  const headers = getHeaders(sheetName);
  ensureHeaders(sheet, headers);
  seedDefaultAdmin(sheetName, sheet, headers);
  return sheet;
}

function getSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  return sheet;
}

function getHeaders(sheetName) {
  const headers = SHEET_HEADERS[sheetName];

  if (!headers) {
    throw new Error("Konfigurasi header tidak ditemukan untuk sheet: " + sheetName);
  }

  return headers;
}

function getIdKey(sheetName) {
  if (sheetName === "tb_admin") {
    return "id_admin";
  }

  if (sheetName === "tb_user") {
    return "id_user";
  }

  return "id_log";
}

function ensureHeaders(sheet, headers) {
  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const valid = headers.every(function (header, index) {
    return currentHeaders[index] === header;
  });

  if (!valid) {
    sheet.getRange(1, 1, 1, sheet.getMaxColumns()).clearContent();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function seedDefaultAdmin(sheetName, sheet, headers) {
  if (sheetName !== "tb_admin" || sheet.getLastRow() > 1) {
    return;
  }

  const admin = Object.assign({}, DEFAULT_ADMIN, {
    created_at: new Date().toISOString(),
  });

  sheet.appendRow(toRow(admin, headers));
}

function getAllRows(sheet, headers) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return values.map(function (row) {
    return normalizeRecord(row, headers);
  });
}

function getRecordByRow(sheet, headers, rowIndex) {
  const row = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
  return normalizeRecord(row, headers);
}

function findRowIndexById(sheet, headers, sheetName, id) {
  const key = getIdKey(sheetName);
  const rows = getAllRows(sheet, headers);
  const index = rows.findIndex(function (item) {
    return String(item[key]) === String(id);
  });

  return index === -1 ? -1 : index + 2;
}

function normalizeRecord(record, headers) {
  const isArray = Array.isArray(record);
  return headers.reduce(function (acc, header, index) {
    acc[header] = isArray ? record[index] || "" : record && record[header] != null ? record[header] : "";
    return acc;
  }, {});
}

function normalizeValues(values, headers) {
  return headers.map(function (_header, index) {
    return values[index] != null ? values[index] : "";
  });
}

function toRow(record, headers) {
  return headers.map(function (header) {
    return record[header] != null ? record[header] : "";
  });
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
