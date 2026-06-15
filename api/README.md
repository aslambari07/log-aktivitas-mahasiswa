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

## Admin Only

- `PATCH /api/activities/:id/verify`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `PATCH /api/users/:id/reset-password`
- `DELETE /api/users/:id`

## Struktur Sheet

- `tb_admin`: `id_admin`, `nama_admin`, `email`, `username`, `password`, `created_at`
- `tb_user`: `id_user`, `id_admin`, `nim`, `nama_lengkap`, `email`, `username`, `password`, `prodi`, `created_at`
- `log_aktivitas`: `id_log`, `id_user`, `judul_kegiatan`, `jenis_aktivitas`, `deskripsi`, `tanggal`, `status`, `bukti_file`, `created_at`
