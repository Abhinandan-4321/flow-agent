import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import teamRoutes from "./routes/teams";
import milestoneRoutes from "./routes/milestones";
import taskRoutes from "./routes/tasks";
import memberRoutes from "./routes/members";
import labelRoutes from "./routes/labels";
import commentRoutes from "./routes/comments";
import userRoutes from "./routes/users";
import { errorHandler } from "./middleware/error";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api", milestoneRoutes);
app.use("/api", taskRoutes);
app.use("/api", memberRoutes);
app.use("/api", labelRoutes);
app.use("/api", commentRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
