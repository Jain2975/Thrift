import { prisma } from "../db/prisma.ts";

export const getCart = async (userId: string) => {
  try {
    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    return cart;
  } catch (err) {
    console.error(err);
    throw new Error("Could not load cart");
  }
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  try {
    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });

      return updatedItem;
    }
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
    return newItem;
  } catch (err) {
    console.error(err);
    throw new Error("Could not add Item to the cart");
  }
};

export const updateCartItem = async (
  userId: string,
  itemId: string,
  quantity: number,
) => {
  try {
    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return updatedItem;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating cart item");
  }
};

export const removeCartItem = async (userId: string, itemId: string) => {
  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Error removing cart item");
  }
};

export const deleteCart = async (userId: string) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return { success: true };
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Error clearing cart");
  }
};
