import type { ButtonHTMLAttributes } from "react";

import { cn } from "../../utils/format";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-gradient-to-r from-primary to-secondary text-white shadow-glass hover:-translate-y-0.5",
        variant === "secondary" &&
          "border border-slate-200/70 bg-white/70 text-textMain hover:bg-surfaceAlt dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
        variant === "ghost" &&
          "text-textSoft hover:bg-slate-200/60 dark:text-darkSoft dark:hover:bg-white/10",
        variant === "danger" && "bg-rose-500 text-white hover:bg-rose-600",
        className
      )}
      {...props}
    />
  );
}
