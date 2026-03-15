import {
  fetchProducts,
  InsertProduct,
  ImportZipProducts,
} from "../controllers/product.controller.ts";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.ts";
import { requireAdmin } from "../middlewares/requireAdmin.ts";
import { validateCreateProduct } from "../middlewares/validateCreateProduct.ts";
import { upload } from "../middlewares/upload.middleware.ts";
const router = Router();

router.get("/", fetchProducts);
router.post(
  "/create",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  validateCreateProduct,
  InsertProduct,
);

router.post(
  "/import",
  requireAuth,
  requireAdmin,
  upload.single("zip"),
  ImportZipProducts,
);

export default router;
