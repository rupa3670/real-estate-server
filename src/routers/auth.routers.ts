import { Router } from "express";
import {
  login,
  logout,
  getMe,
  createUser,
  changePassword,
  getUsers,
  updateUserStatus,
} from "../controllers/auth.controller";
import { auth, authorize } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, getMe);
router.patch("/me/password", auth, changePassword);
router.get("/users", auth, authorize("admin"), getUsers);
router.post("/users", auth, authorize("admin"), createUser);
router.patch("/users/:id/status", auth, authorize("admin"), updateUserStatus);

export default router;