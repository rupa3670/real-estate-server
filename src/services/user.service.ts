
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

const isStaffRole = (
  role: string
): role is "manager" | "accountant" => {
  return role === "manager" || role === "accountant";
};


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
    throw new ApiError(
      400,
      "Role must be manager or accountant"
    );
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

// Get All Users
export const getUsersService = async () => {
  return User.find({
    role: { $ne: "admin" },
  }).sort({ createdAt: -1 });
};

// Update User Status
export const updateUserStatusService = async (
  userId: string,
  isActive: boolean
) => {
  if (typeof isActive !== "boolean") {
    throw new ApiError(400, "isActive must be true or false");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(400, "Admin cannot be blocked");
  }

  user.isActive = isActive;
  await user.save();

  return {
    id: user._id,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
  };
};
