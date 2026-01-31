import { type Request, type Response } from "express";
import { getAllProducts } from "../services/productService.ts";
import { get } from "node:http";

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
