import { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, Trash2, Calendar, User, Flag, Tag, MessageSquare, Clock } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/common/UserAvatar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/useComments";
import { generateTaskId } from "@/lib/taskId";
import { toast } from "sonner";

interface TaskDetailSheetProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailSheet({ taskId, open, onOpenChange }: TaskDetailSheetProps) {
  const { data: task, isLoading } = useTask(taskId ?? undefined);
  const { data: comments } = useComments(taskId ?? undefined);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const createComment = useCreateComment(taskId ?? undefined);
  const deleteComment = useDeleteComment();
  
  const [commentText, setCommentText] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setTitleValue(task.title);
      setDescValue(task.description ?? "");
    }
  }, [task]);

  const handleFieldUpdate = (field: string, value: string | null) => {
    if (!task) return;
    updateTask.mutate(
      { id: task.id, [field]: value } as Parameters<typeof updateTask.mutate>[0],
      {
        onSuccess: () => toast.success("Updated"),
        onError: () => toast.error("Failed to update"),
      }
    );
  };

  const handleTitleSave = () => {
    if (titleValue.trim() && titleValue !== task?.title) {
      handleFieldUpdate("title", titleValue);
    }
    setEditingTitle(false);
  };

  const handleDescSave = () => {
    if (descValue !== (task?.description ?? "")) {
      handleFieldUpdate("description", descValue || null);
    }
    setEditingDesc(false);
  };

  const handleDelete = () => {
    if (!task) return;
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        toast.success("Task deleted");
        onOpenChange(false);
      },
      onError: () => toast.error("Failed to delete task"),
    });
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    createComment.mutate(commentText, {
      onSuccess: () => {
        setCommentText("");
        toast.success("Comment added");
      },
      onError: () => toast.error("Failed to add comment"),
    });
  };

  const handleCommentDelete = (commentId: string) => {
    deleteComment.mutate(commentId, {
      onSuccess: () => toast.success("Comment deleted"),
      onError: () => toast.error("Failed to delete comment"),
    });
  };

  if (!task && !isLoading) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[640px] p-0 flex flex-col gap-0">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-200">
            <div className="flex-1 min-w-0 pr-4">
              {editingTitle ? (
                <Input
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleSave();
                    if (e.key === "Escape") {
                      setTitleValue(task?.title ?? "");
                      setEditingTitle(false);
                    }
                  }}
                  className="text-lg font-semibold"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-lg font-semibold text-zinc-900 cursor-pointer hover:text-zinc-600 transition-colors"
                  onClick={() => setEditingTitle(true)}
                >
                  {task?.title}
                </h2>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-semibold text-zinc-500">
                  #{task?.number ?? 1}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="px-6 py-4 space-y-6">
              {/* Properties Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                    <Flag className="h-3.5 w-3.5" />
                    Status
                  </Label>
                  <Select
                    value={task?.status}
                    onValueChange={(v) => handleFieldUpdate("status", v)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                    <Flag className="h-3.5 w-3.5" />
                    Priority
                  </Label>
                  <Select
                    value={task?.priority}
                    onValueChange={(v) => handleFieldUpdate("priority", v)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Assignee & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Assignee
                  </Label>
                  <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-zinc-200 bg-zinc-50">
                    {task?.assignee ? (
                      <>
                        <UserAvatar
                          name={task.assignee.name}
                          avatarUrl={task.assignee.avatarUrl}
                          className="h-5 w-5"
                        />
                        <span className="text-sm text-zinc-700">{task.assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-sm text-zinc-400">Unassigned</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Due Date
                  </Label>
                  <Input
                    type="date"
                    value={task?.dueDate ? task.dueDate.split("T")[0] : ""}
                    onChange={(e) => handleFieldUpdate("dueDate", e.target.value || null)}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Milestone */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  Milestone
                </Label>
                <div className="flex items-center h-9 px-3 rounded-md border border-zinc-200 bg-zinc-50">
                  <span className="text-sm text-zinc-700">
                    {task?.milestone?.name ?? "No milestone"}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-500">Description</Label>
                {editingDesc ? (
                  <div className="space-y-2">
                    <Textarea
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                      placeholder="Add a description..."
                      rows={6}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleDescSave}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setDescValue(task?.description ?? "");
                          setEditingDesc(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="min-h-[80px] px-3 py-2 rounded-md border border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100 transition-colors"
                    onClick={() => setEditingDesc(true)}
                  >
                    {task?.description ? (
                      <p className="text-sm text-zinc-700 whitespace-pre-wrap">{task.description}</p>
                    ) : (
                      <p className="text-sm text-zinc-400">Add a description...</p>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Comments */}
              <div className="space-y-4">
                <Label className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Comments ({comments?.length ?? 0})
                </Label>

                <div className="space-y-3">
                  {comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                      <UserAvatar
                        name={comment.author.name}
                        avatarUrl={comment.author.avatarUrl}
                        className="h-7 w-7 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-zinc-900">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 ml-auto"
                            onClick={() => handleCommentDelete(comment.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                        <p className="text-sm text-zinc-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleCommentSubmit();
                      }
                    }}
                    rows={2}
                    className="resize-none"
                  />
                  <Button
                    size="sm"
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() || createComment.isPending}
                    className="self-end"
                  >
                    Send
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Metadata */}
              <div className="space-y-2 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Created {format(new Date(task?.createdAt ?? new Date()), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Updated {format(new Date(task?.updatedAt ?? new Date()), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50">
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete task"
        description="This action cannot be undone. This will permanently delete this task and all its comments."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
        loading={deleteTask.isPending}
      />
    </>
  );
}
