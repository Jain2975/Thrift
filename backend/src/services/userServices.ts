import { tr } from "zod/locales";
import { prisma } from "../db/prisma.ts";

export const getOrderHistory = async (userId: string) => {
  try {
    const resp = await prisma.order.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return resp;
  } catch (err) {
    console.log("Error getting user order history: ", err);
  }
};

export const updateUserRole = async (userId: string, role: string) => {
  try {
    const resp = await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
    return resp;
  } catch (err) {
    console.log("Error updating user role: ", err);
    throw err;
  }
};
