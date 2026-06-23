import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createTeam,
  listTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  addProjectToTeam,
  removeProjectFromTeam,
} from "../controllers/teams.controller";

const router = Router();

router.post("/", authMiddleware, createTeam);
router.get("/", authMiddleware, listTeams);
router.get("/:slug", authMiddleware, getTeam);
router.patch("/:id", authMiddleware, updateTeam);
router.delete("/:id", authMiddleware, deleteTeam);

router.post("/:teamId/members", authMiddleware, addTeamMember);
router.delete("/:teamId/members/:userId", authMiddleware, removeTeamMember);

router.post("/:teamId/projects/:projectId", authMiddleware, addProjectToTeam);
router.delete("/:teamId/projects/:projectId", authMiddleware, removeProjectFromTeam);

export default router;
