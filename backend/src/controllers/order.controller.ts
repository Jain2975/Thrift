import type { Request, Response } from "express";
import { createOrderFromCart } from "../services/orderServices.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";
import { prisma } from "../db/prisma.ts";

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

export const getAdminOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Status validation
    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};
