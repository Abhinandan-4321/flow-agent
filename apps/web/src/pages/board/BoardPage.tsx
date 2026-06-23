import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks, useUpdateTaskStatus } from "@/hooks/useTasks";
import { KanbanColumn } from "./components/KanbanColumn";
import { TaskCard } from "./components/TaskCard";
import { TaskDetailSheet } from "./components/TaskDetailSheet";
import { CreateTaskDialog } from "./components/CreateTaskDialog";
import { toast } from "sonner";
import type { Task, Project } from "@/types";

const COLUMNS = [
  { status: "backlog", label: "Backlog" },
  { status: "todo", label: "Todo" },
  { status: "in_progress", label: "In Progress" },
  { status: "in_review", label: "In Review" },
  { status: "done", label: "Done" },
];

export function BoardPage() {
  const { project } = useOutletContext<{ project: Project }>();
  const { data: tasks, isLoading } = useTasks(project?.id);
  const updateStatus = useUpdateTaskStatus();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState("backlog");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const tasksByStatus = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const col of COLUMNS) map[col.status] = [];
    tasks?.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
      else map.backlog.push(t);
    });
    return map;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const task = tasks?.find((t) => t.id === taskId);
    if (!task) return;

    let newStatus: string | null = null;

    if (COLUMNS.some((c) => c.status === over.id)) {
      newStatus = over.id as string;
    } else {
      const overTask = tasks?.find((t) => t.id === over.id);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus && newStatus !== task.status) {
      updateStatus.mutate(
        { id: taskId, status: newStatus },
        {
          onSuccess: () => toast.success("Status updated"),
          onError: () => toast.error("Failed to update status"),
        }
      );
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setSheetOpen(true);
  };

  const handleAddTask = (status: string) => {
    setCreateStatus(status);
    setCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 p-6">
        {COLUMNS.map((col) => (
          <div key={col.status} className="w-72 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-5 gap-3 p-6" style={{ height: "calc(100vh - 3.5rem - 49px)" }}>
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              label={col.label}
              tasks={tasksByStatus[col.status] ?? []}
              onTaskClick={handleTaskClick}
              onAddTask={() => handleAddTask(col.status)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} onClick={() => {}} />}
        </DragOverlay>
      </DndContext>

      <TaskDetailSheet
        taskId={selectedTaskId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      <CreateTaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        projectId={project?.id}
        defaultStatus={createStatus}
      />
    </>
  );
}
