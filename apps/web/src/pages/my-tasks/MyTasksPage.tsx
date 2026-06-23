import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isPast, isFuture } from "date-fns";
import { CheckCircle2, Clock, AlertTriangle, ListTodo, Calendar as CalendarIcon, Filter, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useProjects } from "@/hooks/useProjects";
import { TaskDetailSheet } from "@/pages/board/components/TaskDetailSheet";
import api from "@/lib/api";
import type { Task, ApiResponse } from "@/types";

type FilterType = "all" | "today" | "upcoming" | "overdue" | "completed";

export function MyTasksPage() {
  const user = useAuthStore((s) => s.user);
  const { data: projects } = useProjects();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  const { data: allTasks, isLoading } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: async () => {
      if (!projects?.length) return [];
      const all: Task[] = [];
      for (const p of projects) {
        const res = await api.get<ApiResponse<Task[]>>(`/api/projects/${p.id}/tasks`);
        all.push(...res.data.data);
      }
      return all;
    },
    enabled: !!projects?.length,
  });

  const myTasks = allTasks?.filter((t) => t.assigneeId === user?.id) ?? [];
  const openTasks = myTasks.filter((t) => t.status !== "done");
  const completedTasks = myTasks.filter((t) => t.status === "done");

  const dueToday = openTasks.filter((t) => t.dueDate && isToday(new Date(t.dueDate)));
  const overdue = openTasks.filter((t) => t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)));
  const upcoming = openTasks.filter((t) => t.dueDate && isFuture(new Date(t.dueDate)));

  const getFilteredTasks = () => {
    switch (filter) {
      case "today":
        return dueToday;
      case "upcoming":
        return upcoming;
      case "overdue":
        return overdue;
      case "completed":
        return completedTasks;
      case "all":
      default:
        return openTasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const stats = [
    { label: "Open", value: openTasks.length, icon: ListTodo, color: "bg-blue-100 text-blue-700" },
    { label: "Due Today", value: dueToday.length, icon: Clock, color: "bg-amber-100 text-amber-700" },
    { label: "Overdue", value: overdue.length, icon: AlertTriangle, color: "bg-red-100 text-red-700" },
    { label: "Completed", value: completedTasks.length, icon: CheckCircle2, color: "bg-green-100 text-green-700" },
  ];

  const filters: { label: string; value: FilterType; count: number }[] = [
    { label: "All Open", value: "all", count: openTasks.length },
    { label: "Due Today", value: "today", count: dueToday.length },
    { label: "Upcoming", value: "upcoming", count: upcoming.length },
    { label: "Overdue", value: "overdue", count: overdue.length },
    { label: "Completed", value: "completed", count: completedTasks.length },
  ];

  return (
    <>
      <Header breadcrumbs={[{ label: "My Tasks" }]} />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">My Tasks</h1>
          <p className="text-sm text-zinc-500 mt-1">Tasks assigned to you across all projects</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-sm transition-shadow">
              <CardContent className="pt-5">
                {isLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.value)}
              className="gap-2"
            >
              <Filter className="h-3.5 w-3.5" />
              {f.label} ({f.count})
            </Button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-2">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </>
          ) : filteredTasks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <ListTodo className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-zinc-900">No tasks found</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {filter === "all" ? "Create a task to get started" : "No tasks match this filter"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className="cursor-pointer hover:shadow-md transition-all hover:border-zinc-300"
                onClick={() => {
                  setSelectedTaskId(task.id);
                  setSheetOpen(true);
                }}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-zinc-900 truncate">{task.title}</h3>
                        <StatusBadge status={task.status} />
                      </div>
                      {task.description && (
                        <p className="text-xs text-zinc-500 line-clamp-1 mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        {task.milestone && (
                          <span className="flex items-center gap-1">
                            <Flag className="h-3 w-3" />
                            {task.milestone.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <PriorityBadge priority={task.priority} iconOnly />
                      {task.dueDate && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
                            ? "bg-red-100 text-red-700"
                            : isToday(new Date(task.dueDate))
                            ? "bg-amber-100 text-amber-700"
                            : "bg-zinc-100 text-zinc-700"
                        }`}>
                          <CalendarIcon className="h-3 w-3" />
                          {format(new Date(task.dueDate), "MMM d")}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <TaskDetailSheet taskId={selectedTaskId} open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}
