import { AlertTriangle } from "lucide-react";

import { Button } from "./Button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-[28px] border border-rose-200/80 bg-rose-50/80 p-6 dark:border-rose-400/20 dark:bg-rose-500/10">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-rose-500/10 p-2 text-rose-600 dark:text-rose-300">
          <AlertTriangle size={18} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-rose-700 dark:text-rose-200">Terjadi kendala</h3>
          <p className="mt-1 text-sm text-rose-700/80 dark:text-rose-200/80">{message}</p>
          {onRetry ? (
            <Button className="mt-4" onClick={onRetry} type="button" variant="danger">
              Coba lagi
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
