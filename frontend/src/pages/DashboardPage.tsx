import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck, FileText, LayoutDashboard, UsersRound } from "lucide-react";

import { ActivityAreaChart } from "../components/charts/ActivityAreaChart";
import { ActivityBarChart } from "../components/charts/ActivityBarChart";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Skeleton } from "../components/ui/Skeleton";
import { fetchSummary } from "../services/activityService";

const cards = [
  { key: "totalAktivitas", label: "Total Aktivitas", icon: LayoutDashboard },
  { key: "mahasiswaAktif", label: "Mahasiswa Aktif", icon: UsersRound },
  { key: "aktivitasHariIni", label: "Aktivitas Hari Ini", icon: ClipboardCheck },
  { key: "totalLaporan", label: "Total Laporan", icon: FileText },
] as const;

export function DashboardPage() {
  const { data, isLoading, isError, refetch, error } = useQuery({
    queryKey: ["summary"],
    queryFn: fetchSummary,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Skeleton className="h-36" key={card.key} />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState message={(error as Error)?.message || "Gagal memuat dashboard."} onRetry={() => refetch()} />;
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const value = data.stats[card.key];
          return (
            <article className="animate-floatIn rounded-[28px] border border-white/20 bg-white/70 p-6 shadow-glass backdrop-blur-xl2 dark:border-white/10 dark:bg-darkPanel/80" key={card.key} style={{ animationDelay: `${index * 80}ms` }}>
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 text-primary dark:text-white">
                  <Icon size={22} />
                </div>
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">Realtime</span>
              </div>
              <div className="text-xs uppercase tracking-[0.24em] text-textSoft dark:text-darkSoft">{card.label}</div>
              <div className="mt-2 text-4xl font-black tracking-tight text-textMain dark:text-white">{value}</div>
            </article>
          );
        })}
      </section>
      {data.charts.aktivitasPerTanggal.length ? (
        <section className="grid gap-6 xl:grid-cols-2">
          <ActivityAreaChart data={data.charts.aktivitasPerTanggal} />
          <ActivityBarChart data={data.charts.aktivitasPerMahasiswa.map((item) => ({ name: item.name, total: item.total }))} />
        </section>
      ) : (
        <EmptyState description="Belum ada data aktivitas di Google Sheets. Tambahkan aktivitas pertama untuk mulai melihat statistik." title="Dashboard masih kosong" />
      )}
    </div>
  );
}
