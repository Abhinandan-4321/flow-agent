import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { MyTasksPage } from "@/pages/my-tasks/MyTasksPage";
import { TeamsPage } from "@/pages/teams/TeamsPage";
import { ProjectsPage } from "@/pages/projects/ProjectsPage";
import { ProjectLayout } from "@/pages/projects/ProjectLayout";
import { BoardPage } from "@/pages/board/BoardPage";
import { TasksPage } from "@/pages/tasks/TasksPage";
import { MilestonesPage } from "@/pages/milestones/MilestonesPage";
import { MembersPage } from "@/pages/members/MembersPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { UserSettingsPage } from "@/pages/settings/UserSettingsPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/my-tasks", element: <MyTasksPage /> },
      { path: "/teams", element: <TeamsPage /> },
      { path: "/settings", element: <UserSettingsPage /> },
      { path: "/projects", element: <ProjectsPage /> },
      {
        path: "/projects/:slug",
        element: <ProjectLayout />,
        children: [
          { index: true, element: <Navigate to="board" replace /> },
          { path: "board", element: <BoardPage /> },
          { path: "tasks", element: <TasksPage /> },
          { path: "milestones", element: <MilestonesPage /> },
          { path: "members", element: <MembersPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
      { path: "/", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
