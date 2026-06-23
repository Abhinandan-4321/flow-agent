export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  key?: string | null;
  description: string | null;
  slug: string;
  status: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { tasks: number; members: number; milestones?: number };
  members?: ProjectMember[];
}

export interface ProjectMember {
  id: string;
  role: string;
  joinedAt: string;
  userId: string;
  projectId: string;
  user: User;
}

export interface Milestone {
  id: string;
  name: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { tasks: number };
  tasksByStatus?: Record<string, number>;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  projectId: string;
}

export interface TaskLabel {
  taskId: string;
  labelId: string;
  label: Label;
}

export interface Task {
  id: string;
  number: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  position: number;
  projectId: string;
  milestoneId: string | null;
  assigneeId: string | null;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  assignee?: User | null;
  creator?: User;
  milestone?: { id: string; name: string } | null;
  labels?: TaskLabel[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  details?: Array<{ field: string; message: string }>;
}
