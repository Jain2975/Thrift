import { Response } from "express";
import { prisma } from "../db/prisma.ts";
import { AuthRequest } from "../middlewares/auth.middleware.ts";

export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, reason, details } = req.body;
    const reporterId = req.user.id;

    if (!reason || !productId) {
      return res.status(400).json({ success: false, message: "Reason and product ID are required" });
    }

    const report = await prisma.report.create({
      data: {
        productId,
        reporterId,
        reason,
        details,
      },
    });

    return res.status(201).json({ success: true, report });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: "You have already reported this product" });
    }
    return res.status(500).json({ success: false, message: "Failed to submit report" });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        product: { select: { id: true, name: true, seller: { select: { name: true } } } },
        reporter: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ success: true, reports });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch reports" });
  }
};
