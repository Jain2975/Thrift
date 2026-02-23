import type { Request, Response, NextFunction } from "express";
import { createProductSchema } from "../validator/product.validator";

export const validateCreateProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten(),
    });
  }
  req.body = parsed.data;
  next();
};
