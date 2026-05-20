const HEADERS = [
  "id",
  "nama_mahasiswa",
  "nim",
  "jenis_aktivitas",
  "deskripsi",
  "tanggal",
  "status",
  "bukti_file",
  "created_at",
];

function doGet(e) {
  try {
    const action = e.parameter.action || "list";
    const sheet = getSheet(e.parameter.sheetName || "log_aktivitas");
    ensureHeaders(sheet);

    if (action === "list") {
      return jsonResponse({
        success: true,
        data: getAllActivities(sheet),
      });
    }

    if (action === "getById") {
      const activity = getAllActivities(sheet).find((item) => item.id === e.parameter.id) || null;
      return jsonResponse({
        success: true,
        data: activity,
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
    const sheet = getSheet(body.sheetName || "log_aktivitas");
    ensureHeaders(sheet);

    if (action === "create") {
      const activity = normalizeActivity(body.activity);

      if (!activity.id) {
        activity.id = Utilities.getUuid();
      }

      if (!activity.created_at) {
        activity.created_at = new Date().toISOString();
      }

      sheet.appendRow(HEADERS.map((header) => activity[header] || ""));
      return jsonResponse({ success: true, data: activity });
    }

    if (action === "update") {
      const activity = normalizeActivity(body.activity);
      const rowIndex = findRowIndexById(sheet, body.id);

      if (rowIndex === -1) {
        throw new Error("Data aktivitas tidak ditemukan.");
      }

      activity.id = activity.id || body.id;
      activity.created_at = activity.created_at || sheet.getRange(rowIndex, HEADERS.indexOf("created_at") + 1).getValue();

      sheet.getRange(rowIndex, 1, 1, HEADERS.length).setValues([
        HEADERS.map((header) => activity[header] || ""),
      ]);

      return jsonResponse({ success: true, data: activity });
    }

    if (action === "delete") {
      const rowIndex = findRowIndexById(sheet, body.id);

      if (rowIndex === -1) {
        throw new Error("Data aktivitas tidak ditemukan.");
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

function getSheet(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("Sheet tidak ditemukan: " + sheetName);
  }

  return sheet;
}

function ensureHeaders(sheet) {
  const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const valid = HEADERS.every(function (header, index) {
    return currentHeaders[index] === header;
  });

  if (!valid) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function getAllActivities(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  return values.map(function (row) {
    return HEADERS.reduce(function (acc, header, index) {
      acc[header] = row[index] || "";
      return acc;
    }, {});
  });
}

function findRowIndexById(sheet, id) {
  const activities = getAllActivities(sheet);
  const index = activities.findIndex(function (item) {
    return String(item.id) === String(id);
  });

  return index === -1 ? -1 : index + 2;
}

function normalizeActivity(activity) {
  return HEADERS.reduce(function (acc, header) {
    acc[header] = activity && activity[header] != null ? activity[header] : "";
    return acc;
  }, {});
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
