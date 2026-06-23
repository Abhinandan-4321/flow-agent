import { useState } from "react";
import { Plus, Settings, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { useTeams, useDeleteTeam } from "@/hooks/useTeams";
import { CreateTeamDialog } from "./components/CreateTeamDialog";
import { toast } from "sonner";

export function TeamsPage() {
  const { data: teams, isLoading } = useTeams();
  const deleteTeam = useDeleteTeam();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = (teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      deleteTeam.mutate(teamId, {
        onSuccess: () => toast.success("Team deleted"),
        onError: () => toast.error("Failed to delete team"),
      });
    }
  };

  return (
    <>
      <Header breadcrumbs={[{ label: "Teams" }]} />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Teams</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage your organization's teams</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Team
          </Button>
        </div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : teams?.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-zinc-900">No teams yet</p>
              <p className="text-xs text-zinc-500 mt-1">Create a team to get started</p>
              <Button onClick={() => setDialogOpen(true)} className="mt-4" size="sm">
                Create Team
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {teams?.map((team) => (
              <Card key={team.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{team.name}</CardTitle>
                      <p className="text-xs text-zinc-500 mt-1">@{team.slug}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDelete(team.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {team.description && (
                    <p className="text-xs text-zinc-600 line-clamp-2">{team.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {team.members.length} members
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-3.5 w-3.5" />
                      {team.projects.length} projects
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Manage Team
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateTeamDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
