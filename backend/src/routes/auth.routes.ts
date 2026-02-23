import express, { Router } from "express";

import {
  registerUser,
  editUser,
  removeUser,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.ts";

import { requireAuth } from "../middlewares/auth.middleware.ts";
const router = express.Router();
router.get("/me", requireAuth, getMe);
router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.patch("/:id", requireAuth, editUser);
router.delete("/:id", requireAuth, removeUser);

export default router;
