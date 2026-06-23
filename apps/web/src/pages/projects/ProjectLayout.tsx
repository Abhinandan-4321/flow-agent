import { Outlet, useParams, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { useProject } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";

const tabs = [
  { label: "Board", path: "board" },
  { label: "Tasks", path: "tasks" },
  { label: "Milestones", path: "milestones" },
  { label: "Members", path: "members" },
  { label: "Settings", path: "settings" },
];

export function ProjectLayout() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug);

  if (isLoading) {
    return (
      <>
        <Header breadcrumbs={[{ label: "Projects", href: "/projects" }]} />
        <div className="p-6">
          <Skeleton className="h-8 w-48" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: project?.name ?? "" },
        ]}
      />
      <div className="border-b border-zinc-200">
        <nav className="flex gap-0 px-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/projects/${slug}/${tab.path}`}
              className={({ isActive }) =>
                cn(
                  "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet context={{ project }} />
    </>
  );
}
