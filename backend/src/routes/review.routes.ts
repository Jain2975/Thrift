import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.ts";
import { createReview, getProductReviews } from "../controllers/review.controller.ts";

const router = Router();

router.post("/", requireAuth, createReview);
router.get("/:productId", getProductReviews);

export default router;
