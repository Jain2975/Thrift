import {
  fetchProducts,
  InsertProduct,
  ImportZipProducts,
  RemoveProduct,
  RestoreProduct,
} from "../controllers/product.controller.ts";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.ts";
import { requireAdmin, requireSellerOrAdmin } from "../middlewares/requireAdmin.ts";
import { validateCreateProduct } from "../middlewares/validateCreateProduct.ts";
import { upload } from "../middlewares/upload.middleware.ts";
import { uploadZIP } from "../middlewares/uploadZIP.middleware.ts";
const router = Router();

router.get("/", fetchProducts);
router.post(
  "/create",
  requireAuth,
  requireSellerOrAdmin,
  upload.single("image"),
  validateCreateProduct,
  InsertProduct,
);

router.post(
  "/import",
  requireAuth,
  requireSellerOrAdmin,
  uploadZIP.single("zip"),
  ImportZipProducts,
);

router.delete("/product/:id", requireAuth, requireSellerOrAdmin, RemoveProduct);

router.post("/restore/:id", requireAuth, requireSellerOrAdmin, RestoreProduct);

export default router;
