import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { statusConfig } from "@/components/common/StatusBadge";
import { TaskCard } from "./TaskCard";
import type { Task } from "@/types";

interface KanbanColumnProps {
  status: string;
  label: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
}

export function KanbanColumn({ status, label, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = statusConfig[status];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-full w-full flex-col rounded-lg bg-zinc-50 flex-shrink-0",
        isOver && "bg-zinc-100"
      )}
    >
      <div className="flex items-center gap-2 px-3 py-3">
        <span className={cn("h-2 w-2 rounded-full", config?.dotColor)} />
        <span className="text-sm font-medium text-zinc-700">{label}</span>
        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs font-normal">
          {tasks.length}
        </Badge>
      </div>

      <ScrollArea className="flex-1 px-2 pb-2">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
            ))}
          </div>
        </SortableContext>
      </ScrollArea>

      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-1 text-xs text-zinc-500 hover:text-zinc-700"
          onClick={onAddTask}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
