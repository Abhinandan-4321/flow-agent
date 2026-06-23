import { Router } from "express";
import { addMember, updateMemberRole, removeMember } from "../controllers/members.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/projects/:projectId/members", addMember);
router.patch("/projects/:projectId/members/:userId", updateMemberRole);
router.delete("/projects/:projectId/members/:userId", removeMember);

export default router;
