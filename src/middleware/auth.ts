import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const auth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized: token missing");
  }

  try {
    req.user = verifyToken(header.split(" ")[1]);
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};