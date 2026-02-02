import { Router } from "express";
import {
  fetchCart,
  AddToCart,
  UpdateCartItem,
  DeleteCartItem,
  DeleteCart,
} from "../controllers/cart.controller.ts";
import { requireAuth } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(requireAuth);

router.get("/", fetchCart);
router.post("/items", AddToCart);
router.patch("/items/:itemId", UpdateCartItem);
router.delete("/items/:itemId", DeleteCartItem);
router.delete("/", DeleteCart);

export default router;
