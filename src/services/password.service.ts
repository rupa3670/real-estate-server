
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  if (!currentPassword || !newPassword) {
    throw new ApiError(
      400,
      "Current and new password are required"
    );
  }

  if (newPassword.length < 6) {
    throw new ApiError(
      400,
      "New password must be at least 6 characters"
    );
  }

  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from the current one"
    );
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new ApiError(
      401,
      "Current password is incorrect"
    );
  }

  user.password = newPassword;
  user.mustChangePassword = false;

  await user.save();
};
