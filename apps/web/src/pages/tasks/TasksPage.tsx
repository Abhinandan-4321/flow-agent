import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import { ListFilter, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { UserAvatar } from "@/components/common/UserAvatar";
import { EmptyState } from "@/components/common/EmptyState";
import { useTasks } from "@/hooks/useTasks";
import { TaskDetailSheet } from "@/pages/board/components/TaskDetailSheet";
import { CreateTaskDialog } from "@/pages/board/components/CreateTaskDialog";
import type { Project } from "@/types";

export function TasksPage() {
  const { project } = useOutletContext<{ project: Project }>();
  const [search, setSearch] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const filters: Record<string, string> = {};
  if (search) filters.search = search;

  const { data: tasks, isLoading } = useTasks(project?.id, filters);

  return (
    <>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search tasks..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <ListFilter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : !tasks?.length ? (
          <EmptyState
            icon={ListFilter}
            title="No tasks found"
            description={search ? "Try a different search term." : "Create your first task to get started."}
            actionLabel="Create Task"
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <div className="rounded-lg border border-zinc-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer hover:bg-zinc-50"
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setSheetOpen(true);
                    }}
                  >
                    <TableCell className="font-medium text-zinc-900 max-w-[250px] truncate">{task.title}</TableCell>
                    <TableCell><StatusBadge status={task.status} /></TableCell>
                    <TableCell><PriorityBadge priority={task.priority} /></TableCell>
                    <TableCell>
                      {task.assignee ? (
                        <div className="flex items-center gap-2">
                          <UserAvatar name={task.assignee.name} avatarUrl={task.assignee.avatarUrl} className="h-5 w-5" />
                          <span className="text-sm">{task.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-zinc-500">{task.milestone?.name ?? "—"}</TableCell>
                    <TableCell className="text-sm text-zinc-500">
                      {task.dueDate ? format(new Date(task.dueDate), "MMM d") : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-zinc-400">
                      {format(new Date(task.createdAt), "MMM d")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <TaskDetailSheet taskId={selectedTaskId} open={sheetOpen} onOpenChange={setSheetOpen} />
      <CreateTaskDialog open={createOpen} onOpenChange={setCreateOpen} projectId={project?.id} />
    </>
  );
}
