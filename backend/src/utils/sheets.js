import dayjs from "dayjs";

export const SHEET_HEADERS = [
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

export function mapRowToActivity(row = []) {
  const isArrayRow = Array.isArray(row);
  const mapped = SHEET_HEADERS.reduce((acc, key, index) => {
    acc[key] = isArrayRow ? row[index] || "" : row?.[key] || "";
    return acc;
  }, {});

  return {
    ...mapped,
    tanggalLabel: mapped.tanggal ? dayjs(mapped.tanggal).format("DD MMM YYYY") : "-",
    createdAtLabel: mapped.created_at ? dayjs(mapped.created_at).format("DD MMM YYYY HH:mm") : "-",
  };
}

export function mapActivityToRow(activity) {
  return SHEET_HEADERS.map((key) => activity[key] ?? "");
}

export function getStatusOptions() {
  return ["Pending", "Diproses", "Selesai"];
}
