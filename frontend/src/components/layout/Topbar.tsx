import { Menu } from "lucide-react";

export function Topbar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 rounded-[28px] border border-white/20 bg-white/70 px-5 py-4 backdrop-blur-xl2 dark:border-white/10 dark:bg-darkPanel/80">
      <div className="flex items-center gap-3">
        <button className="rounded-2xl p-2 text-textMain hover:bg-slate-200/70 dark:text-white dark:hover:bg-white/10 lg:hidden" onClick={onMenuClick} type="button">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-textMain dark:text-white">{title}</h1>
          <p className="text-sm text-textSoft dark:text-darkSoft">Pantau dan kelola log aktivitas mahasiswa.</p>
        </div>
      </div>
    </header>
  );
}
