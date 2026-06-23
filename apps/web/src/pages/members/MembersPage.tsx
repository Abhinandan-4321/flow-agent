import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import { Plus, Users, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useAddMember, useRemoveMember } from "@/hooks/useMembers";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import type { Project } from "@/types";

export function MembersPage() {
  const { project } = useOutletContext<{ project: Project }>();
  const user = useAuthStore((s) => s.user);
  const addMember = useAddMember(project?.id);
  const removeMember = useRemoveMember(project?.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");

  const isOwner = project?.ownerId === user?.id;

  const handleInvite = async () => {
    if (!email.trim()) return;
    try {
      await addMember.mutateAsync(email);
      toast.success("Member added");
      setEmail("");
      setDialogOpen(false);
    } catch {
      toast.error("Failed to add member");
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeMember.mutateAsync(userId);
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
  };

  const members = project?.members;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Members"
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        }
      />

      {!members ? (
        <div className="space-y-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : !members.length ? (
        <EmptyState
          icon={Users}
          title="No members"
          description="Invite team members to collaborate on this project."
          actionLabel="Invite Member"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="rounded-lg border border-zinc-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                {isOwner && <TableHead className="w-12" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={member.user.name} avatarUrl={member.user.avatarUrl} />
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{member.user.name}</p>
                        <p className="text-xs text-zinc-500">{member.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.role === "owner" ? "default" : "secondary"}>{member.role}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {format(new Date(member.joinedAt), "MMM d, yyyy")}
                  </TableCell>
                  {isOwner && (
                    <TableCell>
                      {member.role !== "owner" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600" onClick={() => handleRemove(member.userId)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite Member</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={!email.trim() || addMember.isPending}>
              {addMember.isPending ? "Inviting..." : "Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
