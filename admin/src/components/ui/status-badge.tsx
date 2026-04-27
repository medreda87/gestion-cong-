import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected" | "cancelled";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: {
    label: "En attente",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  approved: {
    label: "Approuvé",
    className: "bg-success/10 text-success border-success/20",
  },
  rejected: {
    label: "Refusé",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  cancelled: {
    label: "Annulé",
    className: "bg-muted text-muted-foreground border-muted",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
