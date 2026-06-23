import { useState } from "react";
import { Link } from "react-router-dom";
import { FolderOpen, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useProjects, useCreateProject } from "@/hooks/useProjects";
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
import { useNavigate } from "react-router-dom";

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const navigate = useNavigate();
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
      <Header breadcrumbs={[{ label: "Projects" }]} />
      <div className="p-6 space-y-6">
        <PageHeader
          title="Projects"
          action={
            <Button onClick={() => setDialogOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 w-full" />)}
          </div>
        ) : !projects?.length ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="Create your first project to get started."
            actionLabel="Create project"
            onAction={() => setDialogOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.slug}/board`}>
                <Card className="cursor-pointer hover:shadow-sm transition-shadow h-full">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-zinc-900">{project.name}</h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-2">{project.description || "No description"}</p>
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span>{project._count?.tasks ?? 0} tasks</span>
                      <span>{project._count?.members ?? 0} members</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

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
