import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Milestone as MilestoneIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useMilestones, useDeleteMilestone } from "@/hooks/useMilestones";
import { MilestoneCard } from "./components/MilestoneCard";
import { CreateMilestoneDialog } from "./components/CreateMilestoneDialog";
import { toast } from "sonner";
import type { Project } from "@/types";

export function MilestonesPage() {
  const { project } = useOutletContext<{ project: Project }>();
  const { data: milestones, isLoading } = useMilestones(project?.id);
  const deleteMilestone = useDeleteMilestone();
  const [createOpen, setCreateOpen] = useState(false);

  const handleDelete = (id: string) => {
    deleteMilestone.mutate(id, {
      onSuccess: () => toast.success("Milestone deleted"),
      onError: () => toast.error("Failed to delete milestone"),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Milestones"
        action={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Milestone
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-36 w-full" />)}
        </div>
      ) : !milestones?.length ? (
        <EmptyState
          icon={MilestoneIcon}
          title="No milestones yet"
          description="Create milestones to track progress on groups of tasks."
          actionLabel="Create Milestone"
          onAction={() => setCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {milestones.map((m) => (
            <MilestoneCard key={m.id} milestone={m} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <CreateMilestoneDialog open={createOpen} onOpenChange={setCreateOpen} projectId={project?.id} />
    </div>
  );
}
