import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

function generateSlug(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export async function listProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        _count: { select: { tasks: true, members: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
    return res.json({ data: projects });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { name, description } = req.body;
    const slug = generateSlug(name);

    const project = await prisma.project.create({
      data: {
        name,
        description,
        slug,
        ownerId: userId,
        members: {
          create: { userId, role: "owner" },
        },
      },
      include: {
        _count: { select: { tasks: true, members: true } },
      },
    });

    return res.status(201).json({ data: project });
  } catch (err) {
    next(err);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
        _count: { select: { milestones: true, tasks: true } },
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.json({ data: project });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (project.ownerId !== userId) {
      return res.status(403).json({ error: "Only the owner can update this project" });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: req.body,
    });

    return res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (project.ownerId !== userId) {
      return res.status(403).json({ error: "Only the owner can delete this project" });
    }

    await prisma.project.delete({ where: { id } });
    return res.json({ data: { message: "Project deleted" } });
  } catch (err) {
    next(err);
  }
}
