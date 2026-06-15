export type User = {
  id_admin?: string;
  id_user?: string;
  username: string;
  name: string;
  role: "admin" | "user";
  nama_admin?: string;
  nama_lengkap?: string;
  nim?: string;
  email?: string;
  prodi?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Activity = {
  id: string;
  id_log: string;
  id_user: string;
  judul_kegiatan: string;
  nama_mahasiswa: string;
  nama_lengkap: string;
  nim: string;
  prodi: string;
  email_user: string;
  jenis_aktivitas: string;
  deskripsi: string;
  tanggal: string;
  tanggalLabel: string;
  status: ActivityStatus;
  bukti_file: string;
  created_at: string;
  createdAtLabel: string;
};

export type ActivityStatus = "pending" | "approved" | "rejected";

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
  id_user?: string;
  judul_kegiatan: string;
  jenis_aktivitas: string;
  deskripsi: string;
  tanggal: string;
  status: ActivityStatus;
  bukti_file?: FileList;
  existingBuktiFile?: string;
};

export type UserFormValues = {
  nim: string;
  nama_lengkap: string;
  email: string;
  username: string;
  password?: string;
  prodi: string;
};
