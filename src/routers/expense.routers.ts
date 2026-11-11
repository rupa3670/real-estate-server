import { Router } from "express";
import { auth, authorize } from "../middleware/auth";
import {
  createExpense,
  getExpenses,
  getExpenseSummary,
} from "../controllers/expense.controller";

const router = Router();

router.post("/", auth, authorize("accountant"), createExpense);
router.get("/", auth, authorize("accountant", "admin", "manager"), getExpenses);
router.get(
  "/summary/:projectId",
  auth,
  authorize("accountant", "admin", "manager"),
  getExpenseSummary
);

export default router;