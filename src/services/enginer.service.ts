import mongoose from "mongoose";
import { escapeRegex } from "../utils/escapeRegex";
import { ApiError } from "../utils/ApiError";
import { Engineer } from "../models/Engineer";

interface EngineerInput {
  name?: string;
  phone?: string;
  monthlySalary?: number;
}

const checkId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid engineer id");
  }
};

export const createEngineerService = async (data: EngineerInput) => {
  const { name, phone, monthlySalary } = data;

  if (!name || !phone || monthlySalary === undefined) {
    throw new ApiError(400, "Name, phone and monthly salary are required");
  }
  if (monthlySalary < 0) {
    throw new ApiError(400, "Monthly salary can't be negative");
  }

  const exists = await Engineer.findOne({ phone });
  if (exists) {
    throw new ApiError(409, "An engineer with this phone number already exists");
  }

  return Engineer.create({ name, phone, monthlySalary });
};

export const getEngineersService = async (search?: string) => {
  const filter: Record<string, unknown> = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: regex }, { phone: regex }];
  }

  return Engineer.find(filter).sort({ createdAt: -1 });
};

export const getEngineerByIdService = async (id: string) => {
  checkId(id);

  const engineer = await Engineer.findById(id);
  if (!engineer) throw new ApiError(404, "Engineer not found");

  return engineer;
};

export const updateEngineerService = async (id: string, data: EngineerInput) => {
  checkId(id);

  const { name, phone, monthlySalary } = data;
  const updates: EngineerInput = {};

  if (name !== undefined) updates.name = name;
  if (monthlySalary !== undefined) {
    if (monthlySalary < 0) {
      throw new ApiError(400, "Monthly salary can't be negative");
    }
    updates.monthlySalary = monthlySalary;
  }
  if (phone !== undefined) {
    const taken = await Engineer.findOne({ phone, _id: { $ne: id } });
    if (taken) {
      throw new ApiError(409, "An engineer with this phone number already exists");
    }
    updates.phone = phone;
  }

  const engineer = await Engineer.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!engineer) throw new ApiError(404, "Engineer not found");

  return engineer;
};

export const deleteEngineerService = async (id: string) => {
  checkId(id);

  const engineer = await Engineer.findByIdAndDelete(id);
  if (!engineer) throw new ApiError(404, "Engineer not found");

  return engineer;
};