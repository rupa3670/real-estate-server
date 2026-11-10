import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt";

// Login Service
export const loginService = async (
  email: string,
  phone: string,
  password: string
) => {
  if (!email || !phone || !password) {
    throw new ApiError(400, "Email, phone, and password are required");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedPhone = phone.trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email, phone, or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account is inactive");
  }

  if (user.phone !== normalizedPhone) {
    throw new ApiError(401, "Invalid email, phone, or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email, phone, or password");
  }

  const token = signToken({
    id: user._id.toString(),
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    },
  };
};

// Get Current User Service
export const getMeService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

// Create User Service
const isStaffRole = (
  role: string
): role is "manager" | "accountant" =>
  role === "manager" || role === "accountant";

export const createUserService = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}) => {
  const { name, email, phone, password, role } = data;

  if (!name || !email || !phone || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  if (!isStaffRole(role)) {
    throw new ApiError(400, "Role must be manager or accountant");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedPhone = phone.trim();

  const exists = await User.findOne({
    $or: [
      { email: normalizedEmail },
      { phone: normalizedPhone },
    ],
  });

  if (exists) {
    throw new ApiError(409, "Email or phone already used");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    password,
    role,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};
export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new password are required");
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }
  if (currentPassword === newPassword) {
    throw new ApiError(400, "New password must be different from the current one");
  }

  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new ApiError(401, "Current password is incorrect");

  user.password = newPassword; // 
  user.mustChangePassword = false;
  await user.save();
};