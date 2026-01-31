import api from "../api/axios";

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
  imageUrl?: string;
  category?: string;
  createdAt: string;
};
export type GetProductsResponse = {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const getAllProducts = async (
  page: number = 1,
  limit: number = 12,
): Promise<GetProductsResponse> => {
  const res = await api.get("/products", {
    params: { page, limit },
  });
  return res.data;
};
