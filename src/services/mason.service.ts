import mongoose from "mongoose";
import { escapeRegex } from "../utils/escapeRegex";
import { ApiError } from "../utils/ApiError";
import { Mason } from "../models/Mason";
interface MasonInput {
  name?: string;
  phone?: string;
  dailyWage?: number;
}

const checkId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid mason id");
  }
};

export const createMasonService = async (data: MasonInput) => {
  const { name, phone, dailyWage } = data;

  if (!name || !phone || dailyWage === undefined) {
    throw new ApiError(400, "Name, phone and daily wage are required");
  }
  if (dailyWage < 0) {
    throw new ApiError(400, "Daily wage can't be negative");
  }

  const exists = await Mason.findOne({ phone });
  if (exists) {
    throw new ApiError(409, "A mason with this phone number already exists");
  }

  return Mason.create({ name, phone, dailyWage });
};

export const getMasonsService = async (search?: string) => {
  const filter: Record<string, unknown> = {};

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: regex }, { phone: regex }];
  }

  return Mason.find(filter).sort({ createdAt: -1 });
};

export const getMasonByIdService = async (id: string) => {
  checkId(id);

  const mason = await Mason.findById(id);
  if (!mason) throw new ApiError(404, "Mason not found");

  return mason;
};

export const updateMasonService = async (id: string, data: MasonInput) => {
  checkId(id);

  const { name, phone, dailyWage } = data;
  const updates: MasonInput = {};

  if (name !== undefined) updates.name = name;
  if (dailyWage !== undefined) {
    if (dailyWage < 0) {
      throw new ApiError(400, "Daily wage can't be negative");
    }
    updates.dailyWage = dailyWage;
  }
  if (phone !== undefined) {
    const taken = await Mason.findOne({ phone, _id: { $ne: id } });
    if (taken) {
      throw new ApiError(409, "A mason with this phone number already exists");
    }
    updates.phone = phone;
  }

  const mason = await Mason.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!mason) throw new ApiError(404, "Mason not found");

  return mason;
};

export const deleteMasonService = async (id: string) => {
  checkId(id);

  const mason = await Mason.findByIdAndDelete(id);
  if (!mason) throw new ApiError(404, "Mason not found");

  return mason;
};