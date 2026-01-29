import { type Request, type Response } from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../services/useServices.ts";

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

    res.json({ message: "Login successful", user });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
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
