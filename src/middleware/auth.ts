import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const auth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "Unauthorized: please login");
  }

  let payload: ReturnType<typeof verifyToken>;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(payload.id).select("isActive mustChangePassword");
  if (!user) {
    throw new ApiError(401, "Invalid or expired token");
  }
  if (!user.isActive) {
    throw new ApiError(403, "Your account is inactive");
  }

  (req as AuthRequest).user = payload;

  if (
    user.mustChangePassword &&
    req.path !== "/change-password" &&
    req.path !== "/me"
  ) {
    throw new ApiError(403, "You must change your password before continuing");
  }

  next();
});

export const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied");
    }
    next();
  };