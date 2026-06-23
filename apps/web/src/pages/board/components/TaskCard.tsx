import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isPast, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { generateTaskId } from "@/lib/taskId";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import type { Task, Project } from "@/types";

interface TaskCardProps {
  task: Task;
  project?: Project;
  onClick: () => void;
}

export function TaskCard({ task, project, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== "done";
  const taskId = generateTaskId(project?.key, task.number);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-lg border border-zinc-200 bg-white p-3 hover:shadow-sm transition-shadow",
        isDragging && "opacity-50 shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-medium text-zinc-900 line-clamp-2 flex-1">{task.title}</p>
        <span className="text-xs font-semibold text-zinc-500 flex-shrink-0">{taskId}</span>
      </div>
      {task.description && (
        <p className="mt-1 text-xs text-zinc-500 line-clamp-1">{task.description}</p>
      )}
      <div className="mt-2 flex items-center gap-2">
        <PriorityBadge priority={task.priority} iconOnly />
        {task.assignee && (
          <UserAvatar name={task.assignee.name} avatarUrl={task.assignee.avatarUrl} className="h-5 w-5" />
        )}
        {task.dueDate && (
          <span className={cn("ml-auto text-xs", isOverdue ? "text-red-500 font-medium" : "text-zinc-500")}>
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
        {task.labels && task.labels.length > 0 && (
          <div className="flex gap-1 ml-auto">
            {task.labels.map((tl) => (
              <span
                key={tl.labelId}
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: tl.label.color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
