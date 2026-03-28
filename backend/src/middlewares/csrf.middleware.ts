import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const generateCsrfToken = (req: Request, res: Response) => {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie("_csrf", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ csrfToken: token });
};

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const tokenFromCookie = req.cookies._csrf;
  const tokenFromHeader = req.headers["x-csrf-token"];

  if (!tokenFromCookie || !tokenFromHeader || tokenFromCookie !== tokenFromHeader) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
};
