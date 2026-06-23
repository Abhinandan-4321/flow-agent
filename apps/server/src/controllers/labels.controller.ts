import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export async function listLabels(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;
    const labels = await prisma.label.findMany({
      where: { projectId },
      orderBy: { name: "asc" },
    });
    return res.json({ data: labels });
  } catch (err) {
    next(err);
  }
}

export async function createLabel(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;
    const { name, color } = req.body;

    const label = await prisma.label.create({
      data: { name, color, projectId },
    });

    return res.status(201).json({ data: label });
  } catch (err) {
    next(err);
  }
}

export async function deleteLabel(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.label.delete({ where: { id } });
    return res.json({ data: { message: "Label deleted" } });
  } catch (err) {
    next(err);
  }
}
