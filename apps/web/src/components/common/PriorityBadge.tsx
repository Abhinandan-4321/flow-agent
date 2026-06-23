import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowRight, ArrowUp, AlertTriangle } from "lucide-react";

const priorityConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  low: { label: "Low", className: "bg-zinc-100 text-zinc-600 border-zinc-200", icon: ArrowDown },
  medium: { label: "Medium", className: "bg-blue-50 text-blue-700 border-blue-200", icon: ArrowRight },
  high: { label: "High", className: "bg-orange-50 text-orange-700 border-orange-200", icon: ArrowUp },
  urgent: { label: "Urgent", className: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle },
};

export function PriorityBadge({ priority, iconOnly = false }: { priority: string; iconOnly?: boolean }) {
  const config = priorityConfig[priority] || priorityConfig.medium;
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", config.className)}>
      <Icon className="h-3 w-3" />
      {!iconOnly && config.label}
    </Badge>
  );
}
