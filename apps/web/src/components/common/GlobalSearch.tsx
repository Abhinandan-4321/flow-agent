import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, Users, CheckSquare, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useProjects } from "@/hooks/useProjects";
import { useTeams } from "@/hooks/useTeams";
import api from "@/lib/api";
import type { Task, ApiResponse } from "@/types";

export function GlobalSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: projects } = useProjects();
  const { data: teams } = useTeams();

  // Search tasks across all projects
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["search-tasks", search],
    queryFn: async () => {
      if (!search.trim() || !projects?.length) return [];
      const all: Task[] = [];
      for (const p of projects) {
        try {
          const res = await api.get<ApiResponse<Task[]>>(`/api/projects/${p.id}/tasks`);
          all.push(...res.data.data);
        } catch {
          // Ignore errors
        }
      }
      return all.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
      );
    },
    enabled: !!search.trim() && !!projects?.length,
  });

  const filteredProjects = projects?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const filteredTeams = teams?.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (type: string, _id: string, slug?: string) => {
    setOpen(false);
    setSearch("");

    switch (type) {
      case "project":
        navigate(`/projects/${slug}/board`);
        break;
      case "task":
        // Task detail will be opened via sheet
        break;
      case "team":
        navigate(`/teams`);
        break;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative inline-flex h-9 w-full items-center justify-start rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-500 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-300 md:w-64 lg:w-80"
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-[10px] font-medium text-zinc-600 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search projects, tasks, teams..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          {tasksLoading && search && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            </div>
          )}

          {!search && (
            <CommandEmpty>
              <div className="py-6 text-center text-sm text-zinc-500">
                <p>Press <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">⌘K</kbd> to search</p>
              </div>
            </CommandEmpty>
          )}

          {search && !tasksLoading && !filteredProjects.length && !filteredTeams.length && !tasks?.length && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {filteredProjects.length > 0 && (
            <CommandGroup heading="Projects">
              {filteredProjects.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => handleSelect("project", project.id, project.slug)}
                  className="cursor-pointer"
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  <span>{project.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredTeams.length > 0 && (
            <CommandGroup heading="Teams">
              {filteredTeams.map((team) => (
                <CommandItem
                  key={team.id}
                  onSelect={() => handleSelect("team", team.id)}
                  className="cursor-pointer"
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>{team.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {tasks && tasks.length > 0 && (
            <CommandGroup heading="Tasks">
              {tasks.slice(0, 5).map((task) => (
                <CommandItem
                  key={task.id}
                  onSelect={() => handleSelect("task", task.id)}
                  className="cursor-pointer"
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  <div className="flex flex-col gap-0.5">
                    <span>{task.title}</span>
                    <span className="text-xs text-zinc-500">{task.description?.substring(0, 40)}</span>
                  </div>
                </CommandItem>
              ))}
              {tasks.length > 5 && (
                <CommandItem disabled>
                  <span className="text-xs text-zinc-500">+{tasks.length - 5} more tasks</span>
                </CommandItem>
              )}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
