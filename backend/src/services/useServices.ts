import { prisma } from "../db/prisma.ts";
import bcrypt from "bcryptjs";
export const createUser = async (
  email: string,
  password: string,
  name?: string,
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("Email already exists");
    }
    throw err;
  }
};

export const updateUser = async (
  id: string,
  updates: { name?: string; email?: string },
) => {
  try {
    return await prisma.user.update({
      where: { id },
      data: updates,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Could not update user");
  }
};

export const deleteUser = async (id: string) => {
  try {
    return await prisma.user.delete({
      where: { id },
    });
  } catch (err) {
    console.error(err);
    throw new Error("Could not delete user");
  }
};
