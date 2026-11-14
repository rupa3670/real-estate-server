import { User } from "../models/User";
import { Expense } from "../models/Expense";
import { FundRequest } from "../models/FundRequest";
import { Project } from "../models/Projects";
import {Mason} from "../models/Mason";
export const getStatsService = async () => {
  const [
    users,
    projects,
    pendingRequests,
    statusAgg,
    spentByProject,
    allProjects,
    mesons,
  ] = await Promise.all([
    User.countDocuments({
      role: { $in: ["manager", "accountant"] },
      isActive: true,
    }),
    Project.countDocuments(),
    FundRequest.countDocuments({ status: "pending" }),

    Project.aggregate([{ $group: { _id: "$status", value: { $sum: 1 } } }]),

    Expense.aggregate([
      { $group: { _id: "$project", total: { $sum: "$amount" } } },
    ]),

    Project.find({}, "name estimatedBudget").lean(),

    Mason.countDocuments({ isActive: true }),
  ]);

  const spent = new Map(
    spentByProject.map((e) => [String(e._id), e.total as number])
  );

  const expenseByProject = allProjects.map((p: any) => ({
    name: p.name as string,
    budget: (p.estimatedBudget as number) ?? 0,
    expense: spent.get(String(p._id)) ?? 0,
  }));

  const overBudget = expenseByProject.filter(
    (p) => p.expense > p.budget
  ).length;

  return {
    users,
    projects,
    overBudget,
    pendingRequests,
    mesons,
    projectStatus: statusAgg.map((s) => ({
      status: String(s._id ?? "unknown"),
      value: s.value as number,
    })),
    expenseByProject: [...expenseByProject]
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 6),
  };
};