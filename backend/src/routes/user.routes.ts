import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.ts";

import { getUserOrderHistory, updateUserRoleController } from "../controllers/user.controller.ts";

const router = Router();
router.use(requireAuth);

router.get("/orders", getUserOrderHistory);
router.patch("/role", updateUserRoleController);

export default router;
