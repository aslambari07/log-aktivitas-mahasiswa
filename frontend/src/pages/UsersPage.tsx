import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Skeleton } from "../components/ui/Skeleton";
import { createUser, fetchUsers, removeUser, resetUserPassword, updateUser } from "../services/userService";
import type { User, UserFormValues } from "../types";
import { getErrorMessage } from "../utils/error";

export function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", search],
    queryFn: () => fetchUsers({ search }),
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User berhasil dibuat.");
      closeForm();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Gagal membuat user.")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Omit<UserFormValues, "password"> }) => updateUser(id, payload),
    onSuccess: () => {
      toast.success("User berhasil diperbarui.");
      closeForm();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Gagal memperbarui user.")),
  });

  const resetMutation = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => resetUserPassword(id, password),
    onSuccess: () => {
      toast.success("Password user berhasil direset.");
      setResetOpen(false);
      setSelected(null);
      setNewPassword("");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Gagal reset password.")),
  });

  const deleteMutation = useMutation({
    mutationFn: removeUser,
    onSuccess: () => {
      toast.success("User berhasil dihapus.");
      setDeleteOpen(false);
      setSelected(null);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Gagal menghapus user.")),
  });

  function closeForm() {
    setFormOpen(false);
    setSelected(null);
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-white/20 bg-white/70 p-5 shadow-glass backdrop-blur-xl2 dark:border-white/10 dark:bg-darkPanel/80">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-textSoft dark:text-darkSoft" />
            <Input className="pl-10" onChange={(event) => setSearch(event.target.value)} placeholder="Cari NIM, nama, username, prodi..." value={search} />
          </div>
          <Button onClick={() => { setSelected(null); setFormOpen(true); }} type="button">
            <Plus size={16} />
            Tambah User
          </Button>
        </div>
      </section>

      {isLoading ? (
        <Skeleton className="h-[420px]" />
      ) : isError ? (
        <ErrorState message={(error as Error)?.message || "Gagal memuat data user."} onRetry={() => refetch()} />
      ) : data.length ? (
        <div className="overflow-hidden rounded-[28px] border border-white/20 bg-white/70 shadow-glass backdrop-blur-xl2 dark:border-white/10 dark:bg-darkPanel/80">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100/70 dark:bg-white/5">
                <tr className="text-left text-xs uppercase tracking-[0.22em] text-textSoft dark:text-darkSoft">
                  <th className="px-6 py-4">Mahasiswa</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Prodi</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr className="border-t border-slate-200/70 dark:border-white/10" key={item.id_user}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-textMain dark:text-white">{item.nama_lengkap || item.name}</div>
                      <div className="text-xs text-textSoft dark:text-darkSoft">{item.nim}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-textSoft dark:text-darkSoft">{item.email}</td>
                    <td className="px-6 py-4 text-sm text-textMain dark:text-white">{item.username}</td>
                    <td className="px-6 py-4 text-sm text-textSoft dark:text-darkSoft">{item.prodi}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <IconButton label="Edit" onClick={() => { setSelected(item); setFormOpen(true); }}><Pencil size={16} /></IconButton>
                        <IconButton label="Reset Password" onClick={() => { setSelected(item); setResetOpen(true); }}><KeyRound size={16} /></IconButton>
                        <IconButton label="Hapus" onClick={() => { setSelected(item); setDeleteOpen(true); }}><Trash2 size={16} /></IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState actionLabel="Tambah User" description="Belum ada user mahasiswa pada sheet tb_user." onAction={() => setFormOpen(true)} title="Data user kosong" />
      )}

      <Modal onClose={closeForm} open={formOpen} size="lg" title={selected ? "Edit User" : "Tambah User"}>
        <UserForm
          initialData={selected}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={closeForm}
          onSubmit={async (values) => {
            if (selected?.id_user) {
              const payload = {
                nim: values.nim,
                nama_lengkap: values.nama_lengkap,
                email: values.email,
                username: values.username,
                prodi: values.prodi,
              };
              await updateMutation.mutateAsync({ id: selected.id_user, payload });
              return;
            }
            await createMutation.mutateAsync(values);
          }}
        />
      </Modal>

      <Modal onClose={() => setResetOpen(false)} open={resetOpen} title="Reset Password">
        <div className="grid gap-4">
          <Input onChange={(event) => setNewPassword(event.target.value)} placeholder="Password baru" type="password" value={newPassword} />
          <div className="flex justify-end gap-3">
            <Button onClick={() => setResetOpen(false)} type="button" variant="ghost">Batal</Button>
            <Button disabled={resetMutation.isPending || newPassword.length < 6} onClick={() => selected?.id_user && resetMutation.mutate({ id: selected.id_user, password: newPassword })} type="button">Reset</Button>
          </div>
        </div>
      </Modal>

      <Modal onClose={() => setDeleteOpen(false)} open={deleteOpen} title="Hapus User">
        <p className="text-sm text-textSoft dark:text-darkSoft">
          User <strong className="text-textMain dark:text-white">{selected?.nama_lengkap || selected?.name}</strong> akan dihapus permanen.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={() => setDeleteOpen(false)} type="button" variant="ghost">Batal</Button>
          <Button disabled={deleteMutation.isPending} onClick={() => selected?.id_user && deleteMutation.mutate(selected.id_user)} type="button" variant="danger">Hapus</Button>
        </div>
      </Modal>
    </div>
  );
}

function UserForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: {
  initialData: User | null;
  isSubmitting: boolean;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const { register, handleSubmit } = useForm<UserFormValues>({
    defaultValues: {
      nim: initialData?.nim || "",
      nama_lengkap: initialData?.nama_lengkap || initialData?.name || "",
      email: initialData?.email || "",
      username: initialData?.username || "",
      password: "",
      prodi: initialData?.prodi || "",
    },
  });

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 md:grid-cols-2">
        <Input placeholder="NIM" {...register("nim", { required: true })} />
        <Input placeholder="Nama lengkap" {...register("nama_lengkap", { required: true })} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Input placeholder="Email" type="email" {...register("email", { required: true })} />
        <Input placeholder="Username" {...register("username", { required: true })} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Input placeholder="Program studi" {...register("prodi", { required: true })} />
        {!initialData ? <Input placeholder="Password" type="password" {...register("password", { required: true })} /> : null}
      </div>
      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} type="button" variant="ghost">Batal</Button>
        <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Menyimpan..." : "Simpan"}</Button>
      </div>
    </form>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className="rounded-xl p-2 text-textSoft transition hover:bg-slate-200/70 hover:text-primary dark:text-darkSoft dark:hover:bg-white/10 dark:hover:text-white" onClick={onClick} title={label} type="button">
      {children}
    </button>
  );
}
