import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ActivityAreaChart({ data }: { data: Array<{ date: string; total: number }> }) {
  return (
    <div className="h-[320px] rounded-[28px] border border-white/20 bg-white/70 p-5 shadow-glass backdrop-blur-xl2 dark:border-white/10 dark:bg-darkPanel/80">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-textMain dark:text-white">Tren Aktivitas Mahasiswa</h3>
        <p className="text-sm text-textSoft dark:text-darkSoft">Pergerakan log dalam 7 hari terakhir.</p>
      </div>
      <ResponsiveContainer height="85%" width="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="academicFlow" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Area dataKey="total" fill="url(#academicFlow)" stroke="#2563eb" strokeWidth={3} type="monotone" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
