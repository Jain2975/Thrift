import { type Request, type Response } from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../services/authServices.ts";

import { signToken } from "../utils/jwt.ts";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    const user = await createUser(email, password, name);

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    const token = signToken({ id: user.id, email: user.email });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err: any) {
    res.status(401).json({ message: "Invalid Credentials" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ mesaage: "Logged Out" });
};

export const editUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await updateUser(id, updates);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Error updating user" });
  }
};

export const removeUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: "Error deleting user" });
  }
};
