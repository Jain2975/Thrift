import express, { Router } from "express";

import {
  registerUser,
  editUser,
  removeUser,
  login,
} from "../controllers/user.controller.ts";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.patch("/:id", editUser);
router.delete("/:id", removeUser);

export default router;
