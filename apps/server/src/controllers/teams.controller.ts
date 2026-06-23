import { Request, Response } from "express";
import { prisma } from "@flowagent/db";
import { createSlug } from "../utils/slug";

export const createTeam = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const slug = createSlug(name);
  const team = await prisma.team.create({
    data: {
      name,
      description,
      slug,
      ownerId: userId,
      members: {
        create: {
          userId,
          role: "owner",
        },
      },
    },
    include: {
      members: {
        include: { user: true },
      },
    },
  });

  res.json({ data: team });
};

export const listTeams = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: { user: true },
      },
      projects: {
        include: { project: true },
      },
    },
  });

  res.json({ data: teams });
};

export const getTeam = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      members: {
        include: { user: true },
      },
      projects: {
        include: { project: true },
      },
    },
  });

  if (!team) return res.status(404).json({ error: "Team not found" });

  const isMember = team.members.some((m) => m.userId === userId);
  if (!isMember) return res.status(403).json({ error: "Not a member of this team" });

  res.json({ data: team });
};

export const updateTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const team = await prisma.team.findUnique({
    where: { id },
    include: { members: true },
  });

  if (!team) return res.status(404).json({ error: "Team not found" });

  const isOwner = team.members.some((m) => m.userId === userId && m.role === "owner");
  if (!isOwner) return res.status(403).json({ error: "Only owner can update team" });

  const updated = await prisma.team.update({
    where: { id },
    data: { name, description },
    include: {
      members: {
        include: { user: true },
      },
      projects: {
        include: { project: true },
      },
    },
  });

  res.json({ data: updated });
};

export const deleteTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const team = await prisma.team.findUnique({
    where: { id },
    include: { members: true },
  });

  if (!team) return res.status(404).json({ error: "Team not found" });

  const isOwner = team.members.some((m) => m.userId === userId && m.role === "owner");
  if (!isOwner) return res.status(403).json({ error: "Only owner can delete team" });

  await prisma.team.delete({ where: { id } });

  res.json({ data: { success: true } });
};

export const addTeamMember = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { email, role } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });

  if (!team) return res.status(404).json({ error: "Team not found" });

  const isOwner = team.members.some((m) => m.userId === userId && m.role === "owner");
  if (!isOwner) return res.status(403).json({ error: "Only owner can add members" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const member = await prisma.teamMember.create({
    data: {
      teamId,
      userId: user.id,
      role: role || "member",
    },
    include: { user: true },
  });

  res.json({ data: member });
};

export const removeTeamMember = async (req: Request, res: Response) => {
  const { teamId, userId: memberId } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });

  if (!team) return res.status(404).json({ error: "Team not found" });

  const isOwner = team.members.some((m) => m.userId === userId && m.role === "owner");
  if (!isOwner) return res.status(403).json({ error: "Only owner can remove members" });

  await prisma.teamMember.deleteMany({
    where: { teamId, userId: memberId },
  });

  res.json({ data: { success: true } });
};

export const addProjectToTeam = async (req: Request, res: Response) => {
  const { teamId, projectId } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });

  if (!team) return res.status(404).json({ error: "Team not found" });

  const isOwner = team.members.some((m) => m.userId === userId && m.role === "owner");
  if (!isOwner) return res.status(403).json({ error: "Only owner can add projects" });

  const teamProject = await prisma.teamProject.create({
    data: { teamId, projectId },
    include: { project: true },
  });

  res.json({ data: teamProject });
};

export const removeProjectFromTeam = async (req: Request, res: Response) => {
  const { teamId, projectId } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });

  if (!team) return res.status(404).json({ error: "Team not found" });

  const isOwner = team.members.some((m) => m.userId === userId && m.role === "owner");
  if (!isOwner) return res.status(403).json({ error: "Only owner can remove projects" });

  await prisma.teamProject.deleteMany({
    where: { teamId, projectId },
  });

  res.json({ data: { success: true } });
};
