import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/auth";
import {
  createExpenseService,
  getExpensesService,
  getExpenseSummaryService,
} from "../services/expense.service";

export const createExpense = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;

  const expense = await createExpenseService(req.body, authReq.user!.id);

  res.status(201).json({ success: true, expense });
});

export const getExpenses = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  const projectId = req.query.project as string | undefined;

  const expenses = await getExpensesService(
    authReq.user!.id,
    authReq.user!.role,
    projectId
  );

  res.json({ success: true, expenses });
});

export const getExpenseSummary = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;

  const summary = await getExpenseSummaryService(
    req.params.projectId as string,
    authReq.user!.id,
    authReq.user!.role
  );

  res.json({ success: true, summary });
});