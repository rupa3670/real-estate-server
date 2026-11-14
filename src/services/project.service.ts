import { Project } from "../models/Projects";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export const createProjectService = async (
  data: {
    name: string;
    location: string;
    description?: string;
    estimatedBudget: number;
    manager: string;
    startDate?: string;
    endDate?: string;
  },
  adminId: string
) => {
  const {
    name,
    location,
    description,
    estimatedBudget,
    manager,
    startDate,
    endDate,
  } = data;

  if (!name || !location || !estimatedBudget || !manager) {
    throw new ApiError(400, "Name, location, budget and manager are required");
  }

  if (estimatedBudget <= 0) {
    throw new ApiError(400, "Estimated budget must be greater than 0");
  }

  const managerUser = await User.findById(manager);
  if (!managerUser || managerUser.role !== "manager" || !managerUser.isActive) {
    throw new ApiError(400, "Invalid manager");
  }

  return Project.create({
    name: name.trim(),
    location: location.trim(),
    description: description?.trim(),
    estimatedBudget,
    manager,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    createdBy: adminId,
  });
};

export const getProjectsService = async (userId: string, role: string) => {
  const filter = role === "admin" ? {} : { manager: userId };

  return Project.find(filter)
    .populate("manager", "name email")
    .sort({ createdAt: -1 });
};