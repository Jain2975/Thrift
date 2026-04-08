import { prisma } from "../db/prisma.ts";

export const getWishlist = async (userId: string) => {
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  return wishlist;
};

export const addToWishlist = async (userId: string, productId: string) => {
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId },
    });
  }

  // Use upsert or try/catch to avoid unique constraint failure
  try {
    const item = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
      include: {
        product: true
      }
    });
    return item;
  } catch (error: any) {
    // If it already exists, Prisma will throw a unique constraint error (P2002)
    if (error.code === 'P2002') {
      return null; // Already in wishlist
    }
    throw error;
  }
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });

  if (!wishlist) return null;

  try {
    return await prisma.wishlistItem.delete({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });
  } catch (error) {
    // Item may not exist
    return null;
  }
};
