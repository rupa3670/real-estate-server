import { Router } from "express";
import {
  login,
  logout,
  getMe,
  changePassword,
} from "../controllers/auth.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", auth, getMe);
router.patch("/me/password", auth, changePassword);

export default router;