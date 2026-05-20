import { Eye, Pencil, Trash2 } from "lucide-react";

import type { Activity } from "../types";
import { initials, statusTone } from "../utils/format";

export function ActivityTable({
  items,
  onDetail,
  onEdit,
  onDelete,
}: {
  items: Activity[];
  onDetail: (item: Activity) => void;
  onEdit: (item: Activity) => void;
  onDelete: (item: Activity) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/20 bg-white/70 shadow-glass backdrop-blur-xl2 dark:border-white/10 dark:bg-darkPanel/80">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100/70 dark:bg-white/5">
            <tr className="text-left text-xs uppercase tracking-[0.22em] text-textSoft dark:text-darkSoft">
              <th className="px-6 py-4">Nama Mahasiswa</th>
              <th className="px-6 py-4">NIM</th>
              <th className="px-6 py-4">Jenis Aktivitas</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr className="border-t border-slate-200/70 dark:border-white/10" key={item.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 text-sm font-semibold text-primary dark:text-white">
                      {initials(item.nama_mahasiswa)}
                    </div>
                    <div>
                      <div className="font-medium text-textMain dark:text-white">{item.nama_mahasiswa}</div>
                      <div className="text-xs text-textSoft dark:text-darkSoft">{item.createdAtLabel}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-textSoft dark:text-darkSoft">{item.nim}</td>
                <td className="px-6 py-4 text-sm text-textMain dark:text-white">{item.jenis_aktivitas}</td>
                <td className="px-6 py-4 text-sm text-textSoft dark:text-darkSoft">{item.tanggalLabel}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(item.status)}`}>{item.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <IconButton label="Detail" onClick={() => onDetail(item)}><Eye size={16} /></IconButton>
                    <IconButton label="Edit" onClick={() => onEdit(item)}><Pencil size={16} /></IconButton>
                    <IconButton label="Hapus" onClick={() => onDelete(item)}><Trash2 size={16} /></IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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
