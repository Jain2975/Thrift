import path from "path/win32";
import { prisma } from "../db/prisma.ts";
import { extractZip } from "../utils/zipExtractor.ts";
import fs from "fs";
import csv from "csv-parser";
import { v4 as uuidv4 } from "uuid";
import { parseProductCsv } from "../utils/csvProductParser.ts";
type GetProductOptions = {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  includeDeleted?: boolean;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "ALL";
};
export const getAllProducts = async ({
  page = 1,
  limit = 12,
  minPrice,
  maxPrice,
  category,
  search,
  sortBy,
  includeDeleted = false,
  status,
}: GetProductOptions = {}) => {
  try {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (!includeDeleted) {
      where.isDeleted = false;
    }

    // Status filter (ALL = no filter)
    if (status && status !== "ALL") {
      where.approvalStatus = status;
    }

    if (category) {
      where.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "price_asc") orderBy = { price: "asc" };
    else if (sortBy === "price_desc") orderBy = { price: "desc" };
    else if (sortBy === "newest") orderBy = { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { seller: { select: { id: true, name: true, email: true } } },
      }),
      prisma.product.count({ where }),
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
  thumbnailUrl?: string;
  imageHash?: string;
  category?: string;
  sellerId: string;
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED";
}

export const createProduct = async (data: CreateProductInput) => {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock ?? 0,
      imageUrl: data.imageUrl,
      thumbnailUrl: data.thumbnailUrl,
      imageHash: data.imageHash,
      category: data.category,
      approvalStatus: data.approvalStatus || "APPROVED",
      seller: { connect: { id: data.sellerId } },
    },
  });
};

interface CsvProductRow {
  name: string;
  description?: string;
  price: string;
  stock: string;
  image: string;
  category?: string;
}

export const importProductsFromZip = async (
  zipPath: string,
  sellerId: string,
) => {
  const extractDir = await extractZip(zipPath);

  const csvPath = path.join(extractDir, "products.csv");
  const imagesDir = path.join(extractDir, "images");

  // Validate ZIP structure
  if (!fs.existsSync(csvPath)) {
    throw new Error("products.csv not found in ZIP");
  }

  if (!fs.existsSync(imagesDir)) {
    throw new Error("images folder not found in ZIP");
  }

  let rows: CsvProductRow[];
  // Parse CSV
  try {
    rows = await parseProductCsv(csvPath);
  } catch (err) {
    console.error("CSV parsing error:", err);
    throw new Error("Failed to parse products.csv");
  }

  let imported = 0;
  let failed = 0;
  console.log("Rows:", rows.length);
  for (const row of rows) {
    try {
      const name = row.name?.trim();
      const description = row.description?.trim();
      const price = Number(row.price);
      const stock = Number(row.stock) || 0;
      const category = row.category?.trim();
      const imageName = row.image?.trim();

      if (!name || isNaN(price) || !imageName) {
        console.warn("Invalid row:", row);
        failed++;
        continue;
      }

      const imagePath = path.join(imagesDir, imageName);

      if (!fs.existsSync(imagePath)) {
        console.warn(`Image missing for product: ${name}`);
        failed++;
        continue;
      }

      // Generate unique image name
      const newImageName = `${uuidv4()}-${imageName}`;
      const newImagePath = path.join("uploads/products", newImageName);

      // Copy image
      fs.copyFileSync(imagePath, newImagePath);

      const imageUrl = `/uploads/products/${newImageName}`;

      await createProduct({
        name,
        description,
        price,
        stock,
        imageUrl,
        category,
        sellerId,
        approvalStatus: "PENDING",
      });

      imported++;
    } catch (err) {
      console.error("Import error:", err);
      failed++;
    }
  }

  return {
    imported,
    failed,
    total: rows.length,
  };
};

export const deleteProduct = async (id: string) => {
  return prisma.product.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};

export const restoreProduct = async (id: string) => {
  return prisma.product.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
};

export const approveProduct = async (id: string) => {
  return prisma.product.update({
    where: { id },
    data: {
      approvalStatus: "APPROVED",
    },
  });
};

export const rejectProduct = async (id: string) => {
  return prisma.product.update({
    where: { id },
    data: {
      approvalStatus: "REJECTED",
    },
  });
};

export const updateProduct = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
    category?: string;
  }
) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};
