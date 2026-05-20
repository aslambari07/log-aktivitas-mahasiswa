import { FileSearch } from "lucide-react";

import { Button } from "./Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300/80 bg-white/60 p-10 text-center dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 text-primary dark:text-white">
        <FileSearch size={24} />
      </div>
      <h3 className="text-lg font-semibold text-textMain dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm text-textSoft dark:text-darkSoft">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction} type="button">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
