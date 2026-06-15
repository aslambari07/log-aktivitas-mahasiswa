export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function statusTone(status: string) {
  switch (status) {
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20";
    case "rejected":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20";
    default:
      return "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20";
  }
}

export function statusLabel(status: string) {
  switch (status) {
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    default:
      return "Pending";
  }
}
