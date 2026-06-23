import { Router } from "express";
import { listTasks, createTask, getTask, updateTask, updateTaskStatus, updateTaskPosition, deleteTask } from "../controllers/tasks.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { CreateTaskSchema, UpdateTaskSchema } from "@flowagent/shared";

const router = Router();

router.use(authMiddleware);

router.get("/projects/:projectId/tasks", listTasks);
router.post("/projects/:projectId/tasks", validate(CreateTaskSchema), createTask);
router.get("/tasks/:id", getTask);
router.patch("/tasks/:id", validate(UpdateTaskSchema), updateTask);
router.patch("/tasks/:id/status", updateTaskStatus);
router.patch("/tasks/:id/position", updateTaskPosition);
router.delete("/tasks/:id", deleteTask);

export default router;
