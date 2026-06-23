import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export async function searchUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.query;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email query parameter is required" });
    }

    const users = await prisma.user.findMany({
      where: { email: { contains: email } },
      select: { id: true, name: true, email: true, avatarUrl: true },
      take: 10,
    });

    return res.json({ data: users });
  } catch (err) {
    next(err);
  }
}
