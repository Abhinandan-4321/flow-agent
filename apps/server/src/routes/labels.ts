import { Router } from "express";
import { listLabels, createLabel, deleteLabel } from "../controllers/labels.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { CreateLabelSchema } from "@flowagent/shared";

const router = Router();

router.use(authMiddleware);

router.get("/projects/:projectId/labels", listLabels);
router.post("/projects/:projectId/labels", validate(CreateLabelSchema), createLabel);
router.delete("/labels/:id", deleteLabel);

export default router;
