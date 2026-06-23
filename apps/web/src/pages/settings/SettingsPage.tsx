import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useUpdateProject, useDeleteProject } from "@/hooks/useProjects";
import { toast } from "sonner";
import type { Project } from "@/types";

export function SettingsPage() {
  const { project } = useOutletContext<{ project: Project }>();
  const navigate = useNavigate();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleSave = async () => {
    if (!project) return;
    try {
      await updateProject.mutateAsync({ id: project.id, name, description });
      toast.success("Project updated");
    } catch {
      toast.error("Failed to update project");
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    try {
      await deleteProject.mutateAsync(project.id);
      toast.success("Project deleted");
      navigate("/projects");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
          <CardDescription>Update your project details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button onClick={handleSave} disabled={updateProject.isPending}>
            {updateProject.isPending ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete Project
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project"
        description={`This will permanently delete "${project?.name}" and all its tasks, milestones, and data.`}
        confirmText={project?.name}
        confirmLabel="Delete Project"
        onConfirm={handleDelete}
        destructive
        loading={deleteProject.isPending}
      />
    </div>
  );
}
