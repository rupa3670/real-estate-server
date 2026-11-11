
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt";


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

// Get Current User
export const getMeService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
