import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export async function listMilestones(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;
    const milestones = await prisma.milestone.findMany({
      where: { projectId },
      include: {
        _count: { select: { tasks: true } },
        tasks: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = milestones.map((m) => {
      const tasksByStatus = m.tasks.reduce(
        (acc, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
      const { tasks, ...rest } = m;
      return { ...rest, tasksByStatus };
    });

    return res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function createMilestone(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;
    const { name, description, dueDate } = req.body;

    const milestone = await prisma.milestone.create({
      data: {
        name,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
      },
    });

    return res.status(201).json({ data: milestone });
  } catch (err) {
    next(err);
  }
}

export async function updateMilestone(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, description, dueDate, status } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

    const milestone = await prisma.milestone.update({
      where: { id },
      data,
    });

    return res.json({ data: milestone });
  } catch (err) {
    next(err);
  }
}

export async function deleteMilestone(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.milestone.delete({ where: { id } });
    return res.json({ data: { message: "Milestone deleted" } });
  } catch (err) {
    next(err);
  }
}
