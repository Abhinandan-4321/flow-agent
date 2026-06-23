import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/store/auth.store";
import { useProjects } from "@/hooks/useProjects";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import type { Task, ApiResponse } from "@/types";

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const { data: allTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["dashboard-tasks"],
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
  const today = new Date().toISOString().split("T")[0];
  const dueToday = openTasks.filter((t) => t.dueDate?.startsWith(today));
  const overdue = openTasks.filter((t) => t.dueDate && t.dueDate < today);
  const doneThisWeek = myTasks.filter((t) => {
    if (t.status !== "done") return false;
    const updated = new Date(t.updatedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return updated >= weekAgo;
  });

  const isLoading = projectsLoading || tasksLoading;

  const stats = [
    { label: "My Open Tasks", value: openTasks.length, icon: ListTodo, color: "text-blue-500" },
    { label: "Due Today", value: dueToday.length, icon: Clock, color: "text-amber-500" },
    { label: "Overdue", value: overdue.length, icon: AlertTriangle, color: "text-red-500" },
    { label: "Completed This Week", value: doneThisWeek.length, icon: CheckCircle2, color: "text-green-500" },
  ];

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard" }]} />
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Good {new Date().getHours() < 12 ? "morning" : "afternoon"}, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-zinc-500">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="flex items-center gap-3">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <div>
                      <p className="text-2xl font-semibold text-zinc-900">{stat.value}</p>
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-900">My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : openTasks.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">No open tasks assigned to you</p>
            ) : (
              <div className="space-y-1">
                {openTasks.slice(0, 10).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-zinc-50">
                    <span className="flex-1 text-sm text-zinc-900 truncate">{task.title}</span>
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} iconOnly />
                    {task.dueDate && (
                      <span className="text-xs text-zinc-500">{format(new Date(task.dueDate), "MMM d")}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-3 text-sm font-medium text-zinc-900">Recent Projects</h2>
          <div className="grid grid-cols-4 gap-4">
            {projectsLoading
              ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full" />)
              : projects?.slice(0, 4).map((project) => (
                  <Link key={project.id} to={`/projects/${project.slug}/board`}>
                    <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                      <CardContent className="pt-4">
                        <p className="text-sm font-medium text-zinc-900">{project.name}</p>
                        <p className="mt-1 text-xs text-zinc-500 truncate">{project.description || "No description"}</p>
                        <p className="mt-2 text-xs text-zinc-400">
                          {project._count?.tasks ?? 0} tasks · {project._count?.members ?? 0} members
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
