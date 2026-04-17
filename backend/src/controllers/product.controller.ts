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
} from "../services/productService.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";

  export const fetchProductById = async (req: Request, res: Response) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id as string;
      const product = await prisma.product.findUnique({
        where: { id },
        include: { seller: { select: { id: true, name: true, email: true } } }
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
    const includeDeleted = req.query.includeDeleted === 'true';
    
    // Normal users only see APPROVED products
    const status = "APPROVED";
    
    const data = await getAllProducts({ page, limit, minPrice, maxPrice, category, search, sortBy, includeDeleted, status });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error ! Could not get products" });
  }
};

export const InsertProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;

    const product = await createProduct({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      stock: req.body.stock ? Number(req.body.stock) : 0,
      category: req.body.category,
      imageUrl,
      sellerId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

export const ImportZipProducts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Zip file is required",
      });
    }

    const result = await importProductsFromZip(req.file.path, req.user.id);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to import products",
    });
  }
};

export const RemoveProduct = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    await deleteProduct(productId);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

export const RestoreProduct = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    await restoreProduct(productId);
    return res.status(200).json({
      success: true,
      message: "Product restored successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to restore product",
    });
  }
};

export const fetchAdminProducts = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const status = req.query.status as any || "ALL";
    const data = await getAllProducts({ page, limit, status });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error ! Could not get admin products" });
  }
};

export const ApproveProductHandler = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id as string;
    await approveProduct(productId);
    return res.status(200).json({ success: true, message: "Product approved" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to approve product" });
  }
};

export const RejectProductHandler = async (req: AuthRequest, res: Response) => {
  try {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id as string;
    await rejectProduct(productId);
    return res.status(200).json({ success: true, message: "Product rejected" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to reject product" });
  }
};
