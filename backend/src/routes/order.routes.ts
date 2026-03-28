import { Router } from "express";
import { checkoutOrder } from "../controllers/order.controller.ts";
import { requireAuth } from "../middlewares/auth.middleware.ts";

const router = Router();

router.use(requireAuth);

router.post("/", checkoutOrder);

export default router;
