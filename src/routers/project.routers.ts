import { Router } from "express";
import { auth, authorize } from "../middleware/auth";
import { createProject, getProjects } from "../controllers/project.controller";

const router = Router();

router.post("/", auth, authorize("admin"), createProject);
router.get("/", auth, authorize("admin", "manager"), getProjects);

export default router;