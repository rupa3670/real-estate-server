import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  role: string;
}

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;