import { Router } from "express";
import {
  login,
  logout,
  getMe,
  createUser,
  changePassword,
} from "../controllers/auth.controller";
import { auth, authorize } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, getMe);
router.patch("/change-password", auth, changePassword);
router.post("/users", auth, authorize("admin"), createUser);

export default router;