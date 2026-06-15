import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import type { Activity, ActivityFormValues, User } from "../../types";
import { cn } from "../../utils/format";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const schema = z.object({
  id_user: z.string().optional(),
  judul_kegiatan: z.string().min(1, "Judul kegiatan wajib diisi."),
  jenis_aktivitas: z.string().min(1, "Jenis Aktivitas wajib dipilih."),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi."),
  tanggal: z.string().min(1, "Tanggal wajib dipilih."),
  status: z.enum(["pending", "approved", "rejected"]),
  existingBuktiFile: z.string().optional(),
  bukti_file: z.any().optional(),
});

export function ActivityForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
  users = [],
  isAdmin = false,
}: {
  initialData?: Activity | null;
  isSubmitting: boolean;
  onSubmit: (values: ActivityFormValues) => Promise<void>;
  onCancel: () => void;
  users?: User[];
  isAdmin?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id_user: initialData?.id_user || "",
      judul_kegiatan: initialData?.judul_kegiatan || "",
      jenis_aktivitas: initialData?.jenis_aktivitas || "",
      deskripsi: initialData?.deskripsi || "",
      tanggal: initialData?.tanggal || "",
      status: initialData?.status || "pending",
      existingBuktiFile: initialData?.bukti_file || "",
    },
  });
  const selectedStatus = useWatch({
    control,
    name: "status",
  });

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 md:grid-cols-2">
        {isAdmin ? (
          <Field error={errors.id_user?.message} label="Mahasiswa">
            <select className="w-full rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-textMain outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white" {...register("id_user")}>
              <option value="">Pilih mahasiswa</option>
              {users.map((user) => (
                <option key={user.id_user} value={user.id_user}>
                  {user.nama_lengkap || user.name} - {user.nim}
                </option>
              ))}
            </select>
          </Field>
        ) : null}
        <Field error={errors.judul_kegiatan?.message} label="Judul Kegiatan">
          <Input placeholder="Contoh: Seminar teknologi kampus" {...register("judul_kegiatan")} />
        </Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field error={errors.jenis_aktivitas?.message} label="Jenis Aktivitas">
          <select className="w-full rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-textMain outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white" {...register("jenis_aktivitas")}>
            <option value="">Pilih jenis aktivitas</option>
            <option value="Kuliah">Kuliah</option>
            <option value="Penelitian">Penelitian</option>
            <option value="Bimbingan Skripsi">Bimbingan Skripsi</option>
            <option value="Organisasi">Organisasi</option>
            <option value="Seminar / Workshop">Seminar / Workshop</option>
          </select>
        </Field>
        <Field error={errors.tanggal?.message} label="Tanggal">
          <Input type="date" {...register("tanggal")} />
        </Field>
      </div>
      <Field error={errors.deskripsi?.message} label="Deskripsi">
        <textarea className="min-h-32 w-full rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-textMain outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="Jelaskan aktivitas mahasiswa dengan ringkas dan jelas." {...register("deskripsi")} />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Upload Bukti File">
          <Input accept=".png,.jpg,.jpeg,.webp,.pdf" type="file" {...register("bukti_file")} />
          {initialData?.bukti_file ? (
            <p className="mt-2 text-xs text-textSoft dark:text-darkSoft">
              File saat ini:
              {" "}
              <a className="font-medium text-primary" href={initialData.bukti_file} rel="noreferrer" target="_blank">
                Lihat bukti
              </a>
            </p>
          ) : null}
        </Field>
        <Field error={errors.status?.message} label="Status">
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Disetujui" },
              { value: "rejected", label: "Ditolak" },
            ].map((status) => (
              <label
                className={cn(
                  "cursor-pointer rounded-2xl border px-3 py-3 text-center text-sm font-medium transition",
                  selectedStatus === status.value
                    ? "border-primary bg-gradient-to-r from-primary/15 to-secondary/15 text-primary shadow-sm dark:border-primary dark:text-white"
                    : "border-slate-200/80 bg-white/70 text-textMain hover:border-primary/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
                )}
                key={status.value}
              >
                <input className="sr-only" type="radio" value={status.value} {...register("status")} />
                {status.label}
              </label>
            ))}
          </div>
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button onClick={onCancel} type="button" variant="ghost">
          Batal
        </Button>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Menyimpan..." : initialData ? "Update Aktivitas" : "Simpan Aktivitas"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-textSoft dark:text-darkSoft">{label}</label>
      {children}
      {error ? <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
    </div>
  );
}
