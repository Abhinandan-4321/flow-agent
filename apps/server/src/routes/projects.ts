import { Router } from "express";
import { listProjects, createProject, getProject, updateProject, deleteProject } from "../controllers/projects.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { CreateProjectSchema, UpdateProjectSchema } from "@flowagent/shared";

const router = Router();

router.use(authMiddleware);

router.get("/", listProjects);
router.post("/", validate(CreateProjectSchema), createProject);
router.get("/:slug", getProject);
router.patch("/:id", validate(UpdateProjectSchema), updateProject);
router.delete("/:id", deleteProject);

export default router;
