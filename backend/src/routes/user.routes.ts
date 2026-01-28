import express, { Router } from "express";

import { registerUser,editUser,removeUser } from "../controllers/user.controller.js";

const router=express.Router();

router.post("/register",registerUser);
router.patch("/:id",editUser);
router.delete("/:id",removeUser);

export default router;