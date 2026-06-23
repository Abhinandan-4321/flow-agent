import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string; dotColor: string }> = {
  backlog: { label: "Backlog", className: "bg-zinc-100 text-zinc-600 border-zinc-200", dotColor: "bg-zinc-400" },
  todo: { label: "Todo", className: "bg-blue-50 text-blue-700 border-blue-200", dotColor: "bg-blue-500" },
  in_progress: { label: "In Progress", className: "bg-amber-50 text-amber-700 border-amber-200", dotColor: "bg-amber-500" },
  in_review: { label: "In Review", className: "bg-purple-50 text-purple-700 border-purple-200", dotColor: "bg-purple-500" },
  done: { label: "Done", className: "bg-green-50 text-green-700 border-green-200", dotColor: "bg-green-500" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.backlog;
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", config.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      {config.label}
    </Badge>
  );
}

export function StatusDot({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.backlog;
  return <span className={cn("h-2 w-2 rounded-full", config.dotColor)} />;
}

export { statusConfig };
