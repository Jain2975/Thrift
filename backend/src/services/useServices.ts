import { prisma } from "../db/prisma.js";

export const createUser = async (email: string, name?: string) => {
  try {
    return await prisma.user.create({
      data: { email, name },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("Email already exists");
    }
    throw err;
  }
};

export const updateUser = async (
  email: string,
  updates: { name?: string; email?: string }
) => {
  try {
    return await prisma.user.update({
      where: { email },
      data: updates,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Could not update user");
  }
};

export const deleteUser = async (email: string) => {
  try {
    return await prisma.user.delete({
      where: { email },
    });
  } catch (err) {
    console.error(err);
    throw new Error("Could not delete user");
  }
};
