# API Reference

Base URL default: `http://localhost:5051`

Project ini sekarang mendukung dua mode data source:

- `Google Apps Script Web App` via `GOOGLE_APPS_SCRIPT_URL`
- `Google Sheets API + service account` sebagai fallback

## Public

- `GET /api/health`
- `POST /api/auth/login`

## Protected

Tambahkan header:

`Authorization: Bearer <token>`

- `GET /api/auth/me`
- `GET /api/activities`
- `GET /api/activities/summary`
- `GET /api/activities/:id`
- `POST /api/activities`
- `PUT /api/activities/:id`
- `DELETE /api/activities/:id`

Endpoint `POST` dan `PUT` aktivitas menerima `multipart/form-data`.
