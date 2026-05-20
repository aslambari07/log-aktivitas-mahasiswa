import { google } from "googleapis";

import { env, isGoogleSheetsConfigured } from "./env.js";

let sheetsClient;

export function getSheetsClient() {
  if (!isGoogleSheetsConfigured) {
    throw new Error(
      "Google Sheets belum dikonfigurasi. Lengkapi GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, dan GOOGLE_PRIVATE_KEY di file .env."
    );
  }

  if (!sheetsClient) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.serviceAccountEmail,
        private_key: env.serviceAccountPrivateKey,
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });

    sheetsClient = google.sheets({ version: "v4", auth });
  }

  return sheetsClient;
}
