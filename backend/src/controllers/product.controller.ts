import { type Request, type Response } from "express";
import {
  createProduct,
  getAllProducts,
  importProductsFromZip,
} from "../services/productService.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";

export const fetchProducts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const data = await getAllProducts({ page, limit });
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
