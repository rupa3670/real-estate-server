import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/User";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const allowedBeforePasswordChange = [
  "/api/auth/me",
  "/api/auth/me/password",
  "/api/auth/logout",
];

export const auth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    if (!token) throw new ApiError(401, "Unauthorized: please login");

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(payload.id).select(
      "role isActive mustChangePassword"
    );
    if (!user) throw new ApiError(401, "User no longer exists");

    if (!user.isActive) {
      throw new ApiError(403, "Your account is blocked");
    }

    const path = req.originalUrl.split("?")[0];
    if (user.mustChangePassword && !allowedBeforePasswordChange.includes(path)) {
      throw new ApiError(403, "You must change your password before continuing");
    }

    req.user = { id: payload.id, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied");
    }
    next();
  };