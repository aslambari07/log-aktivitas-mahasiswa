import dayjs from "dayjs";

export const SHEET_NAMES = {
  admin: "tb_admin",
  user: "tb_user",
  activity: "log_aktivitas",
};

export const ADMIN_HEADERS = [
  "id_admin",
  "nama_admin",
  "email",
  "username",
  "password",
  "created_at",
];

export const USER_HEADERS = [
  "id_user",
  "id_admin",
  "nim",
  "nama_lengkap",
  "email",
  "username",
  "password",
  "prodi",
  "created_at",
];

export const ACTIVITY_HEADERS = [
  "id_log",
  "id_user",
  "judul_kegiatan",
  "jenis_aktivitas",
  "deskripsi",
  "tanggal",
  "status",
  "bukti_file",
  "created_at",
];

export function mapRow(headers, row = []) {
  const isArrayRow = Array.isArray(row);
  return headers.reduce((acc, key, index) => {
    acc[key] = isArrayRow ? row[index] || "" : row?.[key] || "";
    return acc;
  }, {});
}

export function mapToRow(headers, item) {
  return headers.map((key) => item[key] ?? "");
}

export function mapRowToAdmin(row = []) {
  return mapRow(ADMIN_HEADERS, row);
}

export function mapAdminToRow(admin) {
  return mapToRow(ADMIN_HEADERS, admin);
}

export function mapRowToUser(row = []) {
  return mapRow(USER_HEADERS, row);
}

export function mapUserToRow(user) {
  return mapToRow(USER_HEADERS, user);
}

export function mapRowToActivity(row = [], user = null) {
  const mapped = mapRow(ACTIVITY_HEADERS, row);
  const namaMahasiswa = user?.nama_lengkap || mapped.nama_mahasiswa || "";
  const nim = user?.nim || mapped.nim || "";

  return {
    ...mapped,
    id: mapped.id_log,
    nama_mahasiswa: namaMahasiswa,
    nama_lengkap: namaMahasiswa,
    nim,
    prodi: user?.prodi || "",
    email_user: user?.email || "",
    tanggalLabel: mapped.tanggal ? dayjs(mapped.tanggal).format("DD MMM YYYY") : "-",
    createdAtLabel: mapped.created_at ? dayjs(mapped.created_at).format("DD MMM YYYY HH:mm") : "-",
  };
}

export function mapActivityToRow(activity) {
  return mapToRow(ACTIVITY_HEADERS, activity);
}

export function getStatusOptions() {
  return ["pending", "approved", "rejected"];
}

export function publicAdmin(admin) {
  const { password: _password, ...safeAdmin } = admin;
  return { ...safeAdmin, role: "admin", name: admin.nama_admin };
}

export function publicUser(user) {
  const { password: _password, ...safeUser } = user;
  return { ...safeUser, role: "user", name: user.nama_lengkap };
}
