import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ id: user._id.toString(), role: user.role });

  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});
export const getMe = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  const user = await User.findById(authReq.user?.id);
//   console.log("email:", email, "user found:", !!user);
  if (!user) throw new ApiError(404, "User not found");

  res.json({ success: true, user });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }
  if (!["manager", "accountant"].includes(role)) {
    throw new ApiError(400, "Role must be manager or accountant");
  }

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) throw new ApiError(409, "Email already used");

  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password,
    role,
  });

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});