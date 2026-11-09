import { Router } from "express";
import { login, getMe,createUser } from "../controllers/auth.controller";
import { auth,authorize } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.get("/me", auth, getMe);
router.post("/Users",auth,authorize("admin"), createUser);

export default router;