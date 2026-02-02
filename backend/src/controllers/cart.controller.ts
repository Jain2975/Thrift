import type { Request, Response } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  deleteCart,
} from "../services/cartService.ts";

import type { AuthRequest } from "../middlewares/auth.middleware.ts";

// Fetch entire cart
export const fetchCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const cart = await getCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error getting the cart" });
  }
};

// Add an item to cart
export const AddToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const item = await addToCart(userId, productId, quantity);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: "Error adding item to cart" });
  }
};

// Update quantity of an item
export const UpdateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;
    const updatedItem = await updateCartItem(userId, itemId, quantity);
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: "Error updating cart item" });
  }
};

// Remove a single item
export const DeleteCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;
    await removeCartItem(userId, itemId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Error removing cart item" });
  }
};

// Clear the entire cart
export const DeleteCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    await deleteCart(userId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Error clearing cart" });
  }
};
