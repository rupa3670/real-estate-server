import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  res.status(status).json({ success: false, message: err.message || "Server error" });
};