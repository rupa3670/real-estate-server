import { asyncHandler } from "../utils/asyncHandler";
import {
  createUserService,
  getUsersService,
  updateUserStatusService,
} from "../services/user.service";

export const createUser = asyncHandler(async (req, res) => {
  const user = await createUserService(req.body);
  res.status(201).json({ success: true, user });
});

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await getUsersService();
  res.json({ success: true, users });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await updateUserStatusService(
    req.params.id as string,
    req.body.isActive
  );

  res.json({
    success: true,
    message: user.isActive ? "User unblocked" : "User blocked",
    user,
  });
});