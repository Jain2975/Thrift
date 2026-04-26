import {
  fetchProducts,
  InsertProduct,
  ImportZipProducts,
  RemoveProduct,
  RestoreProduct,
  fetchAdminProducts,
  ApproveProductHandler,
  RejectProductHandler,
  fetchProductById,
  EditProduct,
  fetchSellerProducts,
} from "../controllers/product.controller.ts";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.ts";
import { requireAdmin, requireSellerOrAdmin } from "../middlewares/requireAdmin.ts";
import { validateCreateProduct } from "../middlewares/validateCreateProduct.ts";
import { upload } from "../middlewares/upload.middleware.ts";
import { uploadZIP } from "../middlewares/uploadZIP.middleware.ts";
import { processImage } from "../utils/imageProcessor.ts";
import rateLimit from "express-rate-limit";

const router = Router();

/** 10 image uploads per IP per hour */
const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many uploads. Please wait before uploading more products.",
  },
});

router.get("/admin", requireAuth, requireAdmin, fetchAdminProducts);
router.post("/approve/:id", requireAuth, requireAdmin, ApproveProductHandler);
router.post("/reject/:id", requireAuth, requireAdmin, RejectProductHandler);

router.get("/product/:id", fetchProductById);
router.get("/", fetchProducts);

router.get("/seller/my-products", requireAuth, requireSellerOrAdmin, fetchSellerProducts);

router.post(
  "/create",
  requireAuth,
  requireSellerOrAdmin,
  uploadRateLimit,
  upload.single("image"),
  processImage,
  validateCreateProduct,
  InsertProduct,
);

router.post(
  "/import",
  requireAuth,
  requireSellerOrAdmin,
  uploadRateLimit,
  uploadZIP.single("zip"),
  ImportZipProducts,
);

router.delete("/product/:id", requireAuth, requireSellerOrAdmin, RemoveProduct);

router.put(
  "/product/:id",
  requireAuth,
  requireSellerOrAdmin,
  upload.single("image"),
  processImage,
  EditProduct,
);

router.post("/restore/:id", requireAuth, requireSellerOrAdmin, RestoreProduct);

export default router;
