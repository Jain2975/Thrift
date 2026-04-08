import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.ts";
import { FetchWishlist, AddItemToWishlist, RemoveItemFromWishlist } from "../controllers/wishlist.controller.ts";

const router = express.Router();

router.get("/", requireAuth, FetchWishlist);
router.post("/add", requireAuth, AddItemToWishlist);
router.delete("/remove/:productId", requireAuth, RemoveItemFromWishlist);

export default router;
