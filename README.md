# Academic Log System

Academic Log System adalah aplikasi web full stack untuk mencatat, memantau, dan mengelola **Log Aktivitas Mahasiswa** dalam satu sistem yang lebih rapi daripada spreadsheet biasa. Sistem ini dirancang agar mahasiswa dapat mengisi aktivitas harian dengan cepat, sementara admin atau dosen dapat memantau, mencari, memfilter, dan melihat detail data dengan lebih mudah.

## Tujuan Project

Project ini dibuat untuk membantu proses pencatatan aktivitas mahasiswa agar:

- input data lebih terstruktur
- monitoring aktivitas lebih mudah
- pencarian dan filter data lebih cepat
- rekap aktivitas lebih jelas
- alur kerja terlihat lebih modern dan siap dikembangkan

## Teknologi yang Digunakan

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express
- Data utama: Google Sheets
- Integrasi Google Sheets:
  - Google Apps Script Web App
  - atau Google Sheets API + Service Account

## Fitur Utama

- Dashboard ringkasan aktivitas mahasiswa
- Statistik utama aktivitas
- CRUD log aktivitas
- Pencarian data secara realtime
- Filter tanggal dan status
- Pagination data
- Detail aktivitas mahasiswa
- Form input aktivitas dengan validasi
- Upload bukti file
- Login sederhana berbasis JWT
- Tampilan responsif
- Empty state, loading state, dan error handling

## Struktur Project

```text
frontend/
backend/
api/
uploads/
frontend/src/components/
frontend/src/pages/
frontend/src/services/
frontend/src/utils/
frontend/src/api/
backend/src/routes/
backend/src/controllers/
backend/src/services/
backend/src/middleware/
```

## Alur Sistem

1. Mahasiswa login ke aplikasi.
2. Mahasiswa mengisi data aktivitas harian.
3. Data dikirim ke backend.
4. Backend menyimpan dan membaca data dari Google Sheets.
5. Data ditampilkan kembali dalam dashboard, tabel, dan detail aktivitas.

## Menjalankan Project Secara Lokal

1. Copy file environment:

```bash
cp .env.example .env
```

2. Install dependency:

```bash
npm install
```

3. Jalankan project:

```bash
npm run dev
```

Default local URL:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5051`

## Login Default

- Username: `admin`
- Password: `admin123`

## Konfigurasi Data

Project ini mendukung dua pendekatan untuk koneksi ke Google Sheets.

### Opsi 1: Google Apps Script

Mode ini paling sederhana dan direkomendasikan untuk penggunaan awal.

Environment yang dipakai:

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
GOOGLE_SHEETS_SPREADSHEET_NAME=Tb_log_aktivitas
GOOGLE_SHEETS_SHEET_NAME=log_aktivitas
```

Script yang dipakai tersedia di:

- [api/google-apps-script.js](/home/aslam/Downloads/Log_Aktivitas_Mahasiswa/api/google-apps-script.js)

### Opsi 2: Google Sheets API + Service Account

Mode ini cocok jika ingin integrasi yang lebih langsung ke Google Sheets API.

Environment yang dipakai:

```env
GOOGLE_SHEETS_SPREADSHEET_NAME=Tb_log_aktivitas
GOOGLE_SHEETS_SHEET_NAME=log_aktivitas
GOOGLE_SHEETS_SPREADSHEET_ID=SPREADSHEET_ID_ANDA
GOOGLE_SERVICE_ACCOUNT_EMAIL=SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nISI_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

## Struktur Kolom Sheet

Header yang digunakan:

```text
id
nama_mahasiswa
nim
jenis_aktivitas
deskripsi
tanggal
status
bukti_file
created_at
```

Jika header belum ada, backend akan menambahkannya otomatis pada sheet `log_aktivitas`.

## Catatan Implementasi

- Upload file disimpan ke folder `uploads/`
- Path file bukti ikut disimpan ke Google Sheets
- Statistik, filter, dan pencarian dihitung dari data sheet
- Jika konfigurasi Google belum lengkap, endpoint aktivitas akan menampilkan pesan error yang sesuai
- Sistem ini cocok sebagai fondasi awal dan masih bisa dikembangkan ke database penuh di tahap berikutnya

## Endpoint Ringkas

Detail endpoint tersedia di:

- [api/README.md](/home/aslam/Downloads/Log_Aktivitas_Mahasiswa/api/README.md)
