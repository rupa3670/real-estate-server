import { Router } from "express";
import { auth, authorize } from "../middleware/auth";
import { createPayment, getPayments } from "../controllers/payment.controller";

const router = Router();

router.post("/", auth, authorize("accountant"), createPayment);
router.get("/", auth, authorize("accountant", "admin"), getPayments);

export default router;