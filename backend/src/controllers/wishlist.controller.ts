import { type Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";
import { getWishlist, addToWishlist, removeFromWishlist } from "../services/wishlistService.ts";

export const FetchWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const wishlist = await getWishlist(req.user.id);
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: "Server Error! Could not get wishlist" });
  }
};

export const AddItemToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    const item = await addToWishlist(req.user.id, productId);
    if (!item) {
      return res.status(400).json({ message: "Item mostly already in wishlist" });
    }
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server Error! Could not add to wishlist" });
  }
};

export const RemoveItemFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    await removeFromWishlist(req.user.id, productId as string);
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Server Error! Could not remove from wishlist" });
  }
};
