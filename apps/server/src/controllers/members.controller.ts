import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export async function addMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;
    const { email } = req.body;
    const userId = req.user!.id;

    // Check requester is a member
    const requesterMembership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!requesterMembership) {
      return res.status(403).json({ error: "You are not a member of this project" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: user.id } },
    });
    if (existingMember) {
      return res.status(409).json({ error: "User is already a member" });
    }

    const member = await prisma.projectMember.create({
      data: { projectId, userId: user.id, role: "member" },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    return res.status(201).json({ data: member });
  } catch (err) {
    next(err);
  }
}

export async function updateMemberRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId, userId: targetUserId } = req.params;
    const requesterId = req.user!.id;
    const { role } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.ownerId !== requesterId) {
      return res.status(403).json({ error: "Only the owner can change roles" });
    }

    const member = await prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId: targetUserId } },
      data: { role },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    return res.json({ data: member });
  } catch (err) {
    next(err);
  }
}

export async function removeMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId, userId: targetUserId } = req.params;
    const requesterId = req.user!.id;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.ownerId !== requesterId) {
      return res.status(403).json({ error: "Only the owner can remove members" });
    }

    if (project.ownerId === targetUserId) {
      return res.status(400).json({ error: "Cannot remove the project owner" });
    }

    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });

    return res.json({ data: { message: "Member removed" } });
  } catch (err) {
    next(err);
  }
}
