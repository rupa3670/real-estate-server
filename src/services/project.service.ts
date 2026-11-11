
import { Project } from "../models/Projects";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export const createProjectService = async (
  data: {
    name: string;
    estimatedBudget: number;
    manager: string;
  },
  adminId: string
) => {
  const { name, estimatedBudget, manager } = data;

  if (!name || !estimatedBudget || !manager) {
    throw new ApiError(400, "All fields are required");
  }

  if (estimatedBudget <= 0) {
    throw new ApiError(400, "Estimated budget must be greater than 0");
  }

  const managerUser = await User.findById(manager);
  if (!managerUser || managerUser.role !== "manager" || !managerUser.isActive) {
    throw new ApiError(400, "Invalid manager");
  }

  const project = await Project.create({
    name: name.trim(),
    estimatedBudget,
    manager,
    createdBy: adminId,
  });

  return project;
};

export const getProjectsService = async (userId: string, role: string) => {
  const filter = role === "admin" ? {} : { manager: userId };

  return Project.find(filter)
    .populate("manager", "name email")
    .sort({ createdAt: -1 });
};