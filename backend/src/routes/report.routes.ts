import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.ts";
import { requireAdmin } from "../middlewares/requireAdmin.ts";
import { createReport, getReports, dismissReport, suspendProduct } from "../controllers/report.controller.ts";

const router = Router();

router.post("/", requireAuth, createReport);
router.get("/admin", requireAuth, requireAdmin, getReports);
router.post("/admin/:id/dismiss", requireAuth, requireAdmin, dismissReport);
router.post("/admin/:id/suspend", requireAuth, requireAdmin, suspendProduct);

export default router;
