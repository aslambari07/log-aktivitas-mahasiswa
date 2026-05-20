import { BarChart3, ClipboardList, LogOut, MoonStar, School, SunMedium } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils/format";

const links = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/aktivitas", label: "Aktivitas", icon: ClipboardList },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {mobileOpen ? <button className="fixed inset-0 z-30 bg-slate-950/45 lg:hidden" onClick={onClose} type="button" /> : null}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-[280px] flex-col border-r border-white/20 bg-white/70 p-6 backdrop-blur-xl2 transition dark:border-white/10 dark:bg-darkPanel/85 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-glass">
            <School size={20} />
          </div>
          <div>
            <div className="text-lg font-black text-primary dark:text-white">Portal Log</div>
            <div className="text-xs uppercase tracking-[0.28em] text-textSoft dark:text-darkSoft">Akademik v1.0</div>
          </div>
        </div>
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-gradient-to-r from-primary/15 to-secondary/15 text-primary dark:text-white"
                      : "text-textSoft hover:bg-white/60 dark:text-darkSoft dark:hover:bg-white/10"
                  )
                }
                key={link.to}
                onClick={onClose}
                to={link.to}
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3 border-t border-slate-200/70 pt-5 dark:border-white/10">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-textSoft hover:bg-white/60 dark:text-darkSoft dark:hover:bg-white/10" onClick={toggleTheme} type="button">
            {theme === "dark" ? <SunMedium size={18} /> : <MoonStar size={18} />}
            {theme === "dark" ? "Mode terang" : "Mode gelap"}
          </button>
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-500/10 dark:text-rose-300" onClick={logout} type="button">
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
