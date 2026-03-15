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
