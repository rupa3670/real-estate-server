import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/auth";
import { cookieOptions } from "../utils/cookieOptions";
import {
  loginService,
  getMeService,
  createUserService,
  changePasswordService,
} from "../services/auth.service";

export const login = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;
  const { token, user } = await loginService(email, phone, password);

  res.cookie("token", token, cookieOptions);
  res.json({ success: true, user });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token", {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
  });
  res.json({ success: true, message: "Logged out" });
});

export const getMe = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  const user = await getMeService(authReq.user?.id as string);
  res.json({ success: true, user });
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await createUserService(req.body);
  res.status(201).json({ success: true, user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;
  const { currentPassword, newPassword } = req.body;

  await changePasswordService(authReq.user!.id, currentPassword, newPassword);

  res.json({ success: true, message: "Password changed successfully" });
});