import { format } from "date-fns";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Milestone } from "@/types";

interface MilestoneCardProps {
  milestone: Milestone;
  onDelete: (id: string) => void;
}

export function MilestoneCard({ milestone, onDelete }: MilestoneCardProps) {
  const total = milestone._count?.tasks ?? 0;
  const done = milestone.tasksByStatus?.done ?? 0;
  const inProgress = milestone.tasksByStatus?.in_progress ?? 0;
  const remaining = total - done - inProgress;
  const progress = total > 0 ? (done / total) * 100 : 0;

  return (
    <Card>
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">{milestone.name}</h3>
            {milestone.description && (
              <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{milestone.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={milestone.status === "completed" ? "default" : "secondary"} className="text-xs">
              {milestone.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-red-600" onClick={() => onDelete(milestone.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {milestone.dueDate && (
          <p className="text-xs text-zinc-500">Due {format(new Date(milestone.dueDate), "MMM d, yyyy")}</p>
        )}

        <div className="space-y-1.5">
          <Progress value={progress} className="h-1.5" />
          <div className="flex gap-3 text-xs text-zinc-500">
            <span>{done} done</span>
            <span>{inProgress} in progress</span>
            <span>{remaining} remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
