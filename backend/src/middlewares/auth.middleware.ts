import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.ts";

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1️ Try Authorization header first
    let token = req.headers.authorization?.split(" ")[1];

    // 2️ Fallback to HTTP-only cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
