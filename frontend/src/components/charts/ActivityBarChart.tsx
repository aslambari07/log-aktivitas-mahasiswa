import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ActivityBarChart({ data }: { data: Array<{ name: string; total: number }> }) {
  return (
    <div className="h-[320px] rounded-[28px] border border-white/20 bg-white/70 p-5 shadow-glass backdrop-blur-xl2 dark:border-white/10 dark:bg-darkPanel/80">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-textMain dark:text-white">Top Mahasiswa Aktif</h3>
        <p className="text-sm text-textSoft dark:text-darkSoft">Mahasiswa dengan log aktivitas terbanyak.</p>
      </div>
      <ResponsiveContainer height="85%" width="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
          <XAxis dataKey="name" hide />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey="total" fill="#7c3aed" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
