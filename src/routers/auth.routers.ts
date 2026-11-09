import { Router } from "express";
import { login, getMe } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.get("/me", auth, getMe);

export default router;