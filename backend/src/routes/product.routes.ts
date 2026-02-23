import {
  fetchProducts,
  InsertProduct,
} from "../controllers/product.controller.ts";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.ts";
import { requireAdmin } from "../middlewares/requireAdmin.ts";
import { validateCreateProduct } from "../middlewares/validateCreateProduct.ts";
const router = Router();

router.get("/", fetchProducts);
router.post(
  "/create",
  requireAuth,
  requireAdmin,
  validateCreateProduct,
  InsertProduct,
);

export default router;
