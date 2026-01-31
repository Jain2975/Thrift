import { prisma } from "../db/prisma.ts";

type GetProductOptions = {
  page?: number;
  limit?: number;
};
export const getAllProducts = async ({
  page = 1,
  limit = 12,
}: GetProductOptions = {}) => {
  try {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (err) {
    console.error(err);
    throw new Error("Could not fetch products");
  }
};
