import { Router } from "express";
import { getStats } from "../controllers/dashboard.controller";
import { auth, authorize } from "../middleware/auth";

const router = Router();

router.get("/stats", auth, authorize("admin"), getStats);

export default router;