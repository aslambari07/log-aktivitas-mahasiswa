import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
  size = "md",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <div className={`w-full rounded-[28px] border border-white/20 bg-white/85 p-6 shadow-glass dark:border-white/10 dark:bg-darkPanel/90 ${size === "lg" ? "max-w-4xl" : "max-w-2xl"}`}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-textMain dark:text-white">{title}</h3>
          <button className="rounded-full p-2 text-textSoft hover:bg-slate-200/70 dark:text-darkSoft dark:hover:bg-white/10" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
