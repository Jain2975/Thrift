import type { Request, Response } from "express";
import { getOrderHistory } from "../services/userServices.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";

export const getUserOrderHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const action = await getOrderHistory(userId);
    res.status(200).json(action);
  } catch (err) {
    console.log("Error calling getUserOrderHistory", err);
  }
};
