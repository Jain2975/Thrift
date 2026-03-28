import type { Request, Response } from "express";
import { getOrderHistory, updateUserRole } from "../services/userServices.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";

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

    // Do not allow users to give themselves ADMIN role or demote an ADMIN this way easily
    if (req.user.role === "ADMIN" && role !== "ADMIN") {
        res.status(403).json({ error: "Admins cannot change their role here." });
        return;
    }

    const updatedUser = await updateUserRole(userId, role);
    
    // Strip sensitive fields
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({ user: userWithoutPassword });
  } catch (err) {
    console.error("Error updating user role", err);
    res.status(500).json({ error: "Failed to update user role." });
  }
}
