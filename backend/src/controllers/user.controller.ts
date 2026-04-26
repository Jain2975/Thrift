import type { Request, Response } from "express";
import { getOrderHistory, updateUserRole } from "../services/userServices.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";
import { signToken } from "../utils/jwt.ts";

export const getUserOrderHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const action = await getOrderHistory(userId);
    res.status(200).json(action);
  } catch (err) {
    console.log("Error calling getUserOrderHistory", err);
  }
};

export const updateUserRoleController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { role } = req.body;

    // Validate role
    if (!["USER", "SELLER"].includes(role)) {
      res.status(400).json({ error: "Invalid role specified." });
      return;
    }

    // Admins cannot demote themselves via this endpoint
    if (req.user.role === "ADMIN") {
      res.status(403).json({ error: "Admins cannot change their role here." });
      return;
    }

    const updatedUser = await updateUserRole(userId, role);

    // Re-issue JWT with the new role so the next request carries the correct role
    const newToken = signToken({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role as any,
    });

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Strip sensitive fields
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ user: userWithoutPassword });
  } catch (err) {
    console.error("Error updating user role", err);
    res.status(500).json({ error: "Failed to update user role." });
  }
};

