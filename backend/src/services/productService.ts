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
interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  category?: string;
  sellerId: string;
}

export const createProduct = async (data: CreateProductInput) => {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock ?? 0,
      imageUrl: data.imageUrl,
      category: data.category,
      seller: { connect: { id: data.sellerId } },
    },
  });
};
