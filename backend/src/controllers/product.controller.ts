import { type Request, type Response } from "express";
import { prisma } from "../db/prisma.ts";
import {
  createProduct,
  getAllProducts,
  importProductsFromZip,
  deleteProduct,
  restoreProduct,
  approveProduct,
  rejectProduct,
  updateProduct,
} from "../services/productService.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";
import { hashDistance } from "../utils/imageProcessor.ts";

/** Hamming-distance threshold for "near duplicate" perceptual hash */
const DUPE_THRESHOLD = 8; // out of 64 bits

export const fetchProductById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { seller: { select: { id: true, name: true, email: true } } },
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const fetchProducts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const includeDeleted = req.query.includeDeleted === "true";
    const status = "APPROVED";
    const data = await getAllProducts({
      page, limit, minPrice, maxPrice, category, search, sortBy, includeDeleted, status,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error! Could not get products" });
  }
};

export const InsertProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;
    const thumbnailUrl = (req.file as any).thumbnailUrl as string | undefined;
    const imageHash = (req.file as any).imageHash as string | undefined;

    // ── Perceptual-hash duplicate check ────────────────────────────────────
    if (imageHash) {
      const existing = await prisma.product.findMany({
        where: { imageHash: { not: null }, sellerId: { not: req.user.id } },
        select: { id: true, name: true, imageHash: true },
      });
      const duplicate = existing.find(
        (p) => p.imageHash && hashDistance(imageHash, p.imageHash) <= DUPE_THRESHOLD
      );
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `This image is too similar to an existing product ("${duplicate.name}"). Please use an original photo.`,
        });
      }
    }

    const product = await createProduct({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      stock: req.body.stock ? Number(req.body.stock) : 0,
      category: req.body.category,
      imageUrl,
      thumbnailUrl,
      imageHash,
      sellerId: req.user.id,
    });

    return res.status(201).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create product" });
  }
};

export const ImportZipProducts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Zip file is required" });
    }
    const result = await importProductsFromZip(req.file.path, req.user.id);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to import products" });
  }
};

export const RemoveProduct = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await deleteProduct(productId);
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

export const RestoreProduct = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await restoreProduct(productId);
    return res.status(200).json({ success: true, message: "Product restored successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to restore product" });
  }
};

export const fetchAdminProducts = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const status = (req.query.status as any) || "ALL";
    const data = await getAllProducts({ page, limit, status });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error! Could not get admin products" });
  }
};

export const ApproveProductHandler = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
    await approveProduct(productId);
    return res.status(200).json({ success: true, message: "Product approved" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to approve product" });
  }
};

export const RejectProductHandler = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
    await rejectProduct(productId);
    return res.status(200).json({ success: true, message: "Product rejected" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to reject product" });
  }
};

export const EditProduct = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : (req.params.id as string);
    const userId = req.user.id;
    const userRole = req.user.role;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (product.sellerId !== userId && userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden — you can only edit your own products",
      });
    }

    const updatedData: any = {};
    if (req.body.name) updatedData.name = req.body.name;
    if (req.body.description !== undefined) updatedData.description = req.body.description;
    if (req.body.price) updatedData.price = Number(req.body.price);
    if (req.body.stock !== undefined) updatedData.stock = Number(req.body.stock);
    if (req.body.category) updatedData.category = req.body.category;

    // ── Image changed → re-approval required ──────────────────────────────
    if (req.file) {
      updatedData.imageUrl = `/uploads/products/${req.file.filename}`;
      updatedData.thumbnailUrl = (req.file as any).thumbnailUrl ?? null;
      updatedData.imageHash = (req.file as any).imageHash ?? null;

      // Force back to PENDING so admin reviews the new image
      if (userRole !== "ADMIN") {
        updatedData.approvalStatus = "PENDING";
      }
    }

    const updatedProduct = await updateProduct(productId, updatedData);
    return res.status(200).json({
      success: true,
      message: req.file
        ? "Product updated. Image change requires re-approval."
        : "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Failed to edit product", error);
    return res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

export const fetchSellerProducts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { sellerId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where: { sellerId: userId } }),
    ]);

    res.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error! Could not get seller products" });
  }
};
