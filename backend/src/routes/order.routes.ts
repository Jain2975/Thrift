import { Router } from "express";
import { checkoutOrder, getAdminOrders, updateOrderStatus, getSellerOrders } from "../controllers/order.controller.ts";
import { requireAuth } from "../middlewares/auth.middleware.ts";
import { requireAdmin, requireSellerOrAdmin } from "../middlewares/requireAdmin.ts";

const router = Router();

router.use(requireAuth);

router.post("/", checkoutOrder);
router.get("/admin", requireAdmin, getAdminOrders);
router.patch("/admin/:id/status", requireAdmin, updateOrderStatus);
router.get("/seller/orders", requireAuth, requireSellerOrAdmin, getSellerOrders);

export default router;
