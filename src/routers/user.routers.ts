import { Router } from "express";
import { auth, authorize } from "../middleware/auth";
import {
  createUser,
  getUsers,
  updateUserStatus,
} from "../controllers/user.controller";

const router = Router();

router.get("/", auth, authorize("admin"), getUsers);
router.post("/", auth, authorize("admin"), createUser);
router.patch("/:id/status", auth, authorize("admin"), updateUserStatus);

export default router;