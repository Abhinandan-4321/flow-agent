import { Router } from "express";
import { listComments, createComment, deleteComment } from "../controllers/comments.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { CreateCommentSchema } from "@flowagent/shared";

const router = Router();

router.use(authMiddleware);

router.get("/tasks/:taskId/comments", listComments);
router.post("/tasks/:taskId/comments", validate(CreateCommentSchema), createComment);
router.delete("/comments/:id", deleteComment);

export default router;
