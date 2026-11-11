import mongoose from "mongoose";
import { Expense } from "../models/Expense";
import { ApiError } from "../utils/ApiError";
import { Project } from "../models/Projects";

const categories = ["materials", "salary_wages", "equipment", "others"] as const;
type ExpenseCategory = (typeof categories)[number];

const isExpenseCategory = (value: string): value is ExpenseCategory =>
  (categories as readonly string[]).includes(value);

const getAccessibleProject = async (
  projectId: string,
  userId: string,
  role: string
) => {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new ApiError(400, "Invalid project id");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (role === "manager" && project.manager.toString() !== userId) {
    throw new ApiError(403, "This is not your project");
  }

  return project;
};

export const createExpenseService = async (
  data: {
    project: string;
    category: string;
    amount: number;
    description?: string;
    date?: string;
  },
  accountantId: string
) => {
  const { project, category, amount, description, date } = data;

  if (!project || !category || amount === undefined) {
    throw new ApiError(400, "Project, category and amount are required");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ApiError(400, "Amount must be a number greater than 0");
  }

  if (!isExpenseCategory(category)) {
    throw new ApiError(400, "Invalid category");
  }

  // accountant shob project-e expense likhte pare, tai role "accountant" dilam
  await getAccessibleProject(project, accountantId, "accountant");

  return Expense.create({
    project,
    category,
    amount,
    description: description?.trim(),
    date: date ? new Date(date) : undefined,
    recordedBy: accountantId,
  });
};

export const getExpensesService = async (
  userId: string,
  role: string,
  projectId?: string
) => {
  const filter: Record<string, unknown> = {};

  if (projectId) {
    await getAccessibleProject(projectId, userId, role);
    filter.project = projectId;
  } else if (role === "manager") {
    // manager shudhu nijer project-er expense dekhbe
    const own = await Project.find({ manager: userId }).select("_id");
    filter.project = { $in: own.map((p) => p._id) };
  }

  return Expense.find(filter)
    .populate("project", "name")
    .populate("recordedBy", "name")
    .sort({ date: -1 });
};

export const getExpenseSummaryService = async (
  projectId: string,
  userId: string,
  role: string
) => {
  const project = await getAccessibleProject(projectId, userId, role);

  const expenses = await Expense.find({ project: project._id });
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const percentUsed = (totalExpense / project.estimatedBudget) * 100;

  // PRD: 80% ar 100% e alert
  let alert: "ok" | "warning" | "over_budget" = "ok";
  if (percentUsed >= 100) alert = "over_budget";
  else if (percentUsed >= 80) alert = "warning";

  return {
    project: { id: project._id, name: project.name },
    estimatedBudget: project.estimatedBudget,
    totalExpense,
    remaining: project.estimatedBudget - totalExpense,
    percentUsed: Math.round(percentUsed * 100) / 100,
    alert,
  };
};