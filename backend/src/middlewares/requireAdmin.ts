import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware.ts";

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized - User not authenticated",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Forbidden - Admin access required",
    });
  }

  next();
};

export const requireSellerOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized - User not authenticated",
    });
  }

  if (req.user.role !== "ADMIN" && req.user.role !== "SELLER") {
    return res.status(403).json({
      message: "Forbidden - Admin or Seller access required",
    });
  }

  next();
};
