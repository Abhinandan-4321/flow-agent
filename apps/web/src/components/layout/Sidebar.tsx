import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus, CheckSquare, Settings, Zap, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth.store";
import { useProjects, useCreateProject } from "@/hooks/useProjects";
import { UserAvatar } from "@/components/common/UserAvatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-cyan-500"];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: projects } = useProjects();
  const createProject = useCreateProject();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const project = await createProject.mutateAsync({ name, description });
      setDialogOpen(false);
      setName("");
      setDescription("");
      toast.success("Project created");
      navigate(`/projects/${project.slug}/board`);
    } catch {
      toast.error("Failed to create project");
    }
  };

  return (
    <>
      <aside className="fixed left-0 top-0 z-30 flex h-full w-60 flex-col border-r border-zinc-200 bg-zinc-50">
        <div className="flex h-14 items-center gap-2 px-4">
          <Zap className="h-5 w-5 text-zinc-900" />
          <span className="text-sm font-semibold text-zinc-900">FlowAgent</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <div className="space-y-0.5">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-sm font-normal text-zinc-600",
                  location.pathname === "/dashboard" && "bg-zinc-100 text-zinc-900 font-medium"
                )}
                size="sm"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/my-tasks">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-sm font-normal text-zinc-600",
                  location.pathname === "/my-tasks" && "bg-zinc-100 text-zinc-900 font-medium"
                )}
                size="sm"
              >
                <CheckSquare className="h-4 w-4" />
                My Tasks
              </Button>
            </Link>
          </div>

          <Separator className="my-3" />

          <div className="mb-3">
            <Link to="/teams">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-sm font-normal text-zinc-600",
                  location.pathname === "/teams" && "bg-zinc-100 text-zinc-900 font-medium"
                )}
                size="sm"
              >
                <Users className="h-4 w-4" />
                Teams
              </Button>
            </Link>
          </div>

          <Separator className="my-3" />

          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Projects
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-zinc-500 hover:text-zinc-900"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-0.5">
            {projects?.map((project, i) => {
              const isActive = location.pathname.startsWith(`/projects/${project.slug}`);
              return (
                <Link key={project.id} to={`/projects/${project.slug}/board`}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-sm font-normal text-zinc-600",
                      isActive && "bg-zinc-100 text-zinc-900 font-medium border-l-2 border-zinc-900 rounded-l-none"
                    )}
                    size="sm"
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded text-[10px] font-semibold text-white",
                        colors[i % colors.length]
                      )}
                    >
                      {project.name[0].toUpperCase()}
                    </span>
                    <span className="truncate">{project.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        <Separator />
        <div className="flex items-center gap-2 px-4 py-3">
          {user && (
            <>
              <UserAvatar name={user.name} avatarUrl={user.avatarUrl} />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900">{user.name}</p>
                <p className="truncate text-xs text-zinc-500">{user.email}</p>
              </div>
              <Link to="/settings">
                <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </Link>
            </>
          )}
        </div>
      </aside>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || createProject.isPending}>
              {createProject.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
