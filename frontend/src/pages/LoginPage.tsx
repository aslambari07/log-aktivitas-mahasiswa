import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/error";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast.success("Login berhasil.");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Login gagal."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.18),transparent_28%),linear-gradient(180deg,#eef4ff_0%,#f8f9ff_100%)] px-4 dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.18),transparent_26%),linear-gradient(180deg,#07111f_0%,#0b1628_100%)]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/30 bg-white/75 shadow-glass backdrop-blur-xl2 dark:border-white/10 dark:bg-darkPanel/85 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),linear-gradient(135deg,#2563eb,#7c3aed)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-xs uppercase tracking-[0.28em]">Google Stitch to Production</div>
            <h1 className="max-w-md text-4xl font-black leading-tight">Log Aktivitas Mahasiswa realtime.</h1>
          </div>
          <p className="max-w-md text-sm text-white/80">
            Dashboard akademik dengan visual glassmorphism, kontrol aktivitas harian, statistik realtime, dan integrasi Google Sheets.
          </p>
        </section>
        <section className="p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-textMain dark:text-white">Masuk ke Portal Log</h2>
            <p className="mt-2 text-sm text-textSoft dark:text-darkSoft">Gunakan kredensial admin sederhana untuk mengakses dashboard.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-textSoft dark:text-darkSoft">Username</label>
              <Input onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} placeholder="admin" value={form.username} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-textSoft dark:text-darkSoft">Password</label>
              <Input onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="••••••••" type="password" value={form.password} />
            </div>
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
            </Button>
            <p className="text-xs text-textSoft dark:text-darkSoft">
              Default development login:
              {" "}
              <span className="font-semibold"></span>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
