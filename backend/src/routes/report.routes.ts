import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.ts";
import { requireAdmin } from "../middlewares/requireAdmin.ts";
import { createReport, getReports } from "../controllers/report.controller.ts";

const router = Router();

router.post("/", requireAuth, createReport);
router.get("/admin", requireAuth, requireAdmin, getReports);

export default router;
