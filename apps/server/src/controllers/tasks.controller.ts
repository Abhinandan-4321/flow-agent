import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export async function listTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;
    const { status, priority, assigneeId, milestoneId, search } = req.query;

    const where: any = { projectId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;
    if (milestoneId) where.milestoneId = milestoneId;
    if (search) where.title = { contains: search as string };

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
        labels: { include: { label: true } },
        milestone: { select: { id: true, name: true } },
      },
      orderBy: { position: "asc" },
    });

    return res.json({ data: tasks });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;
    const userId = req.user!.id;
    const { title, description, status, priority, milestoneId, assigneeId, dueDate } = req.body;

    // Get the next task number for this project
    const lastTask = await prisma.task.findFirst({
      where: { projectId },
      orderBy: { number: "desc" },
      select: { number: true },
    });
    const nextNumber = (lastTask?.number ?? 0) + 1;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        number: nextNumber,
        milestoneId: milestoneId || null,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        position: Date.now(),
        projectId,
        creatorId: userId,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
        labels: { include: { label: true } },
        milestone: { select: { id: true, name: true } },
      },
    });

    return res.status(201).json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
        creator: { select: { id: true, name: true, email: true, avatarUrl: true } },
        labels: { include: { label: true } },
        milestone: { select: { id: true, name: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data: any = { ...req.body };
    if (data.dueDate !== undefined) {
      data.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    const task = await prisma.task.update({
      where: { id },
      data,
      include: {
        assignee: { select: { id: true, name: true, email: true, avatarUrl: true } },
        labels: { include: { label: true } },
        milestone: { select: { id: true, name: true } },
      },
    });

    return res.json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function updateTaskStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { status },
    });

    return res.json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function updateTaskPosition(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { position } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { position },
    });

    return res.json({ data: task });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    return res.json({ data: { message: "Task deleted" } });
  } catch (err) {
    next(err);
  }
}
