import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import type { Activity, ActivityFormValues } from "../../types";
import { cn } from "../../utils/format";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const schema = z.object({
  nama_mahasiswa: z.string().min(1, "Nama Mahasiswa wajib diisi."),
  nim: z.string().regex(/^\d+$/, "NIM hanya boleh angka."),
  jenis_aktivitas: z.string().min(1, "Jenis Aktivitas wajib dipilih."),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi."),
  tanggal: z.string().min(1, "Tanggal wajib dipilih."),
  status: z.enum(["Pending", "Diproses", "Selesai"]),
  existingBuktiFile: z.string().optional(),
  bukti_file: z.any().optional(),
});

export function ActivityForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: {
  initialData?: Activity | null;
  isSubmitting: boolean;
  onSubmit: (values: ActivityFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nama_mahasiswa: initialData?.nama_mahasiswa || "",
      nim: initialData?.nim || "",
      jenis_aktivitas: initialData?.jenis_aktivitas || "",
      deskripsi: initialData?.deskripsi || "",
      tanggal: initialData?.tanggal || "",
      status: initialData?.status || "Pending",
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
        <Field error={errors.nama_mahasiswa?.message} label="Nama Mahasiswa">
          <Input placeholder="Masukkan nama lengkap" {...register("nama_mahasiswa")} />
        </Field>
        <Field error={errors.nim?.message} label="NIM">
          <Input placeholder="Nomor induk mahasiswa" {...register("nim")} />
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
            {["Pending", "Diproses", "Selesai"].map((status) => (
              <label
                className={cn(
                  "cursor-pointer rounded-2xl border px-3 py-3 text-center text-sm font-medium transition",
                  selectedStatus === status
                    ? "border-primary bg-gradient-to-r from-primary/15 to-secondary/15 text-primary shadow-sm dark:border-primary dark:text-white"
                    : "border-slate-200/80 bg-white/70 text-textMain hover:border-primary/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
                )}
                key={status}
              >
                <input className="sr-only" type="radio" value={status} {...register("status")} />
                {status}
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
