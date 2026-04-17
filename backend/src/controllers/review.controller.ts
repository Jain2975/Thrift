import { Request, Response } from "express";
import { prisma } from "../db/prisma.ts";
import { AuthRequest } from "../middlewares/auth.middleware.ts";

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Valid rating (1-5) is required" });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: Number(rating),
        comment,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return res.status(201).json({ success: true, review });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: "You have already reviewed this product" });
    }
    return res.status(500).json({ success: false, message: "Failed to create review" });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};
