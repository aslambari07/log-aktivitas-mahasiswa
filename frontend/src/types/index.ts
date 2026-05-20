export type User = {
  username: string;
  name: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Activity = {
  id: string;
  nama_mahasiswa: string;
  nim: string;
  jenis_aktivitas: string;
  deskripsi: string;
  tanggal: string;
  tanggalLabel: string;
  status: "Pending" | "Diproses" | "Selesai";
  bukti_file: string;
  created_at: string;
  createdAtLabel: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ActivityListResponse = {
  items: Activity[];
  pagination: Pagination;
};

export type SummaryResponse = {
  stats: {
    totalAktivitas: number;
    mahasiswaAktif: number;
    aktivitasHariIni: number;
    totalLaporan: number;
  };
  charts: {
    aktivitasPerTanggal: Array<{ date: string; total: number }>;
    aktivitasPerStatus: Array<{ name: string; value: number }>;
    aktivitasPerMahasiswa: Array<{ nim: string; name: string; total: number }>;
  };
};

export type ActivityFormValues = {
  nama_mahasiswa: string;
  nim: string;
  jenis_aktivitas: string;
  deskripsi: string;
  tanggal: string;
  status: "Pending" | "Diproses" | "Selesai";
  bukti_file?: FileList;
  existingBuktiFile?: string;
};
