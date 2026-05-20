import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { ActivityTable } from "../components/ActivityTable";
import { ActivityForm } from "../components/forms/ActivityForm";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Skeleton } from "../components/ui/Skeleton";
import { createActivity, fetchActivities, removeActivity, updateActivity } from "../services/activityService";
import type { Activity, ActivityFormValues } from "../types";
import { getErrorMessage } from "../utils/error";
import { statusTone } from "../utils/format";

export function ActivitiesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Activity | null>(null);

  const params = useMemo(() => ({ search, status, dateFrom, dateTo, page, limit: 8 }), [search, status, dateFrom, dateTo, page]);

  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ["activities", params],
    queryFn: () => fetchActivities(params),
  });

  const createMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      toast.success("Aktivitas berhasil ditambahkan.");
      closeForm();
      refreshAll();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Gagal menambah aktivitas.")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ActivityFormValues }) => updateActivity(id, payload),
    onSuccess: () => {
      toast.success("Aktivitas berhasil diperbarui.");
      closeForm();
      refreshAll();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Gagal memperbarui aktivitas.")),
  });

  const deleteMutation = useMutation({
    mutationFn: removeActivity,
    onSuccess: () => {
      toast.success("Aktivitas berhasil dihapus.");
      setDeleteOpen(false);
      setSelected(null);
      refreshAll();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Gagal menghapus aktivitas.")),
  });

  function refreshAll() {
    queryClient.invalidateQueries({ queryKey: ["activities"] });
    queryClient.invalidateQueries({ queryKey: ["summary"] });
  }

  function closeForm() {
    setFormOpen(false);
    setSelected(null);
  }

  async function handleSubmit(values: ActivityFormValues) {
    if (selected) {
      await updateMutation.mutateAsync({ id: selected.id, payload: values });
      return;
    }
    await createMutation.mutateAsync(values);
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-white/20 bg-white/70 p-5 shadow-glass backdrop-blur-xl2 dark:border-white/10 dark:bg-darkPanel/80">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-textSoft dark:text-darkSoft" />
            <Input
              className="pl-10"
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Cari nama, NIM, atau aktivitas..."
              value={search}
            />
          </div>
          <select className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-textMain outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white" onChange={(event) => { setStatus(event.target.value); setPage(1); }} value={status}>
            <option value="">Semua status</option>
            <option value="Pending">Pending</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
          <Input onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} type="date" value={dateFrom} />
          <Input onChange={(event) => { setDateTo(event.target.value); setPage(1); }} type="date" value={dateTo} />
          <Button onClick={() => { setSelected(null); setFormOpen(true); }} type="button">
            <Plus size={16} />
            Tambah Data
          </Button>
        </div>
      </section>
      {isLoading ? (
        <Skeleton className="h-[420px]" />
      ) : isError ? (
        <ErrorState message={(error as Error)?.message || "Gagal memuat data aktivitas."} onRetry={() => refetch()} />
      ) : data?.items.length ? (
        <>
          <ActivityTable
            items={data.items}
            onDelete={(item) => {
              setSelected(item);
              setDeleteOpen(true);
            }}
            onDetail={(item) => {
              setSelected(item);
              setDetailOpen(true);
            }}
            onEdit={(item) => {
              setSelected(item);
              setFormOpen(true);
            }}
          />
          <div className="flex items-center justify-between rounded-[24px] border border-white/20 bg-white/70 px-5 py-4 text-sm dark:border-white/10 dark:bg-darkPanel/80">
            <span className="text-textSoft dark:text-darkSoft">
              Menampilkan
              {" "}
              <strong>{data.items.length}</strong>
              {" "}
              dari
              {" "}
              <strong>{data.pagination.total}</strong>
              {" "}
              data
            </span>
            <div className="flex items-center gap-2">
              <Button disabled={data.pagination.page === 1} onClick={() => setPage((current) => current - 1)} type="button" variant="secondary">
                Prev
              </Button>
              <span className="px-2 text-textSoft dark:text-darkSoft">
                {data.pagination.page} / {data.pagination.totalPages}
              </span>
              <Button disabled={data.pagination.page >= data.pagination.totalPages} onClick={() => setPage((current) => current + 1)} type="button" variant="secondary">
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState actionLabel="Tambah Aktivitas" description="Belum ada aktivitas yang cocok dengan filter saat ini. Coba ubah pencarian atau tambah log baru." onAction={() => setFormOpen(true)} title="Data aktivitas kosong" />
      )}

      <Modal onClose={closeForm} open={formOpen} size="lg" title={selected ? "Edit Log Aktivitas" : "Tambah Log Aktivitas"}>
        <ActivityForm initialData={selected} isSubmitting={createMutation.isPending || updateMutation.isPending} onCancel={closeForm} onSubmit={handleSubmit} />
      </Modal>

      <Modal onClose={() => setDetailOpen(false)} open={detailOpen} title="Detail Aktivitas">
        {selected ? (
          <div className="grid gap-4 text-sm">
            <DetailRow label="Nama Mahasiswa" value={selected.nama_mahasiswa} />
            <DetailRow label="NIM" value={selected.nim} />
            <DetailRow label="Jenis Aktivitas" value={selected.jenis_aktivitas} />
            <DetailRow label="Tanggal" value={selected.tanggalLabel} />
            <DetailRow label="Status" value={<span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(selected.status)}`}>{selected.status}</span>} />
            <DetailRow label="Deskripsi" value={selected.deskripsi} />
            <DetailRow
              label="Bukti File"
              value={
                selected.bukti_file ? (
                  <a className="font-medium text-primary" href={selected.bukti_file} rel="noreferrer" target="_blank">
                    Lihat file bukti
                  </a>
                ) : (
                  "Tidak ada file"
                )
              }
            />
          </div>
        ) : null}
      </Modal>

      <Modal onClose={() => setDeleteOpen(false)} open={deleteOpen} title="Hapus Aktivitas">
        <p className="text-sm text-textSoft dark:text-darkSoft">
          Aktivitas
          {" "}
          <strong className="text-textMain dark:text-white">{selected?.jenis_aktivitas}</strong>
          {" "}
          milik
          {" "}
          <strong className="text-textMain dark:text-white">{selected?.nama_mahasiswa}</strong>
          {" "}
          akan dihapus permanen.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={() => setDeleteOpen(false)} type="button" variant="ghost">
            Batal
          </Button>
          <Button disabled={deleteMutation.isPending} onClick={() => selected && deleteMutation.mutate(selected.id)} type="button" variant="danger">
            {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="mb-1 text-xs uppercase tracking-[0.22em] text-textSoft dark:text-darkSoft">{label}</div>
      <div className="text-sm text-textMain dark:text-white">{value}</div>
    </div>
  );
}
