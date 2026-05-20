import type { InputHTMLAttributes } from "react";

import { cn } from "../../utils/format";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-textMain outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-darkSoft",
        className
      )}
      {...props}
    />
  );
}
