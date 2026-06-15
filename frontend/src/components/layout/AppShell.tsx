import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const titles: Record<string, string> = {
  "/": "Portal Akademik",
  "/aktivitas": "Data Aktivitas Mahasiswa",
};

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.14),transparent_26%),linear-gradient(180deg,#f8f9ff_0%,#edf4ff_100%)] text-textMain dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.16),transparent_30%),linear-gradient(180deg,#07111f_0%,#0a1629_100%)] dark:text-white">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="min-h-screen lg:ml-[280px]">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Topbar onMenuClick={() => setMobileOpen(true)} title={titles[location.pathname] || "Academic Log"} />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
