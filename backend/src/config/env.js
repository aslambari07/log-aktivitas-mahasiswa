import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), "../.env") });
config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5051),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "academic-log-secret",
  loginUsername: process.env.APP_LOGIN_USERNAME || "admin",
  loginPassword: process.env.APP_LOGIN_PASSWORD || "admin123",
  appsScriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL || "",
  spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "",
  spreadsheetName: process.env.GOOGLE_SHEETS_SPREADSHEET_NAME || "Tb_log_aktivitas",
  sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || "log_aktivitas",
  serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
  serviceAccountPrivateKey: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 10),
  uploadDir:
    process.env.UPLOAD_DIR ||
    (process.env.VERCEL ? "/tmp/uploads" : resolve(process.cwd(), "uploads")),
};

export const isGoogleSheetsConfigured =
  Boolean(env.spreadsheetId) &&
  Boolean(env.serviceAccountEmail) &&
  Boolean(env.serviceAccountPrivateKey);

export const isAppsScriptConfigured = Boolean(env.appsScriptUrl);
