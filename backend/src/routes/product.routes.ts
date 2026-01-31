import { fetchProducts } from "../controllers/product.controller.ts";
import { Router } from "express";

const router = Router();

router.get("/", fetchProducts);

export default router;
