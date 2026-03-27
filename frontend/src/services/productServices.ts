import api from "../api/axios";

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isDeleted: boolean;
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
export const createProduct = async (data: FormData) => {
  const res = await api.post("/products/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.product;
};

export const ImportProductZip = async (zipFile: File) => {
  const fromData = new FormData();
  fromData.append("zip", zipFile);

  const res = await api.post("/products/import", fromData);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/product/${id}`);
  return res.data;
};

export const restoreProduct = async (id: string) => {
  const res = await api.post(`/products/restore/${id}`);
  return res.data;
};
