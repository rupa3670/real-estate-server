import { Router } from "express";

import { auth, authorize } from "../middleware/auth";
import { createMason, deleteMason, getMasonById, getMasons, updateMason } from "../controllers/meson.controller";

const router = Router();

router.use(auth);

router.get("/", authorize("admin", "manager", "accountant"), getMasons);
router.get("/:id", authorize("admin", "manager", "accountant"), getMasonById);
router.post("/", authorize("admin"), createMason);
router.put("/:id", authorize("admin"), updateMason);
router.delete("/:id", authorize("admin"), deleteMason);

export default router;