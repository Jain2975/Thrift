import type { Request, Response } from "express";
import { createOrderFromCart } from "../services/orderServices.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";

// Handle checkout process by converting cart to an order
export const checkoutOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const newOrder = await createOrderFromCart(userId);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error: any) {
    if (error.message === "Cart is empty") {
      res.status(400).json({ error: "Cart is empty" });
    } else {
      res.status(500).json({ error: "Error checking out" });
    }
  }
};
