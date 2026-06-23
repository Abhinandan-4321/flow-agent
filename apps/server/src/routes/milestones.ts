import { Router } from "express";
import { listMilestones, createMilestone, updateMilestone, deleteMilestone } from "../controllers/milestones.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { CreateMilestoneSchema, UpdateMilestoneSchema } from "@flowagent/shared";

const router = Router();

router.use(authMiddleware);

router.get("/projects/:projectId/milestones", listMilestones);
router.post("/projects/:projectId/milestones", validate(CreateMilestoneSchema), createMilestone);
router.patch("/milestones/:id", validate(UpdateMilestoneSchema), updateMilestone);
router.delete("/milestones/:id", deleteMilestone);

export default router;
