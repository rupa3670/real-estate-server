import { Router } from "express";

import { auth, authorize } from "../middleware/auth";
import { createEngineer, deleteEngineer, getEngineerById, getEngineers, updateEngineer } from "../controllers/engineer.controller";


const router = Router();

router.use(auth);

router.get("/", authorize("admin", "manager", "accountant"), getEngineers);
router.get("/:id", authorize("admin", "manager", "accountant"), getEngineerById);
router.post("/", authorize("admin"), createEngineer);
router.put("/:id", authorize("admin"), updateEngineer);
router.delete("/:id", authorize("admin"), deleteEngineer);

export default router;