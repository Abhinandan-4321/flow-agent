import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export async function listComments(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        author: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    return res.json({ data: comments });
  } catch (err) {
    next(err);
  }
}

export async function createComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { taskId } = req.params;
    const userId = req.user!.id;
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: { content, taskId, authorId: userId },
      include: {
        author: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    return res.status(201).json({ data: comment });
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.authorId !== userId) {
      return res.status(403).json({ error: "Only the author can delete this comment" });
    }

    await prisma.comment.delete({ where: { id } });
    return res.json({ data: { message: "Comment deleted" } });
  } catch (err) {
    next(err);
  }
}
