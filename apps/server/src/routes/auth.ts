import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { CreateUserSchema, LoginSchema } from "@flowagent/shared";

const router = Router();

router.post("/register", validate(CreateUserSchema), register);
router.post("/login", validate(LoginSchema), login);
router.get("/me", authMiddleware, me);

export default router;
