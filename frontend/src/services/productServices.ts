import api from "../api/axios";

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock: number;
  approvalStatus: string;
  sellerId: string;
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
  minPrice?: number,
  maxPrice?: number,
  category?: string,
  search?: string,
  sortBy?: string,
  includeDeleted?: boolean,
): Promise<GetProductsResponse> => {
  const res = await api.get("/products", {
    params: { page, limit, minPrice, maxPrice, category, search, sortBy, includeDeleted },
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

export const getProductById = async (id: string) => {
  const res = await api.get(`/products/product/${id}`);
  return res.data.product;
};

export const getProductReviews = async (productId: string) => {
  const res = await api.get(`/reviews/${productId}`);
  return res.data.reviews;
};

export const createReview = async (productId: string, rating: number, comment: string) => {
  const res = await api.post(`/reviews`, { productId, rating, comment });
  return res.data.review;
};

export const createReport = async (productId: string, reason: string, details: string) => {
  const res = await api.post(`/reports`, { productId, reason, details });
  return res.data;
};

export const createConversation = async (receiverId: string) => {
  const res = await api.post(`/chats/conversations`, { receiverId });
  return res.data.conversation;
};
