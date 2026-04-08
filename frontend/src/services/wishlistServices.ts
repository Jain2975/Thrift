import api from "../api/axios";

export type WishlistItem = {
  id: string;
  wishlistId: string;
  productId: string;
  product: any; // Ideally import Product type from productServices
  createdAt: string;
}

export type Wishlist = {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export const getWishlist = async (): Promise<Wishlist> => {
  const res = await api.get("/wishlist");
  return res.data;
};

export const addToWishlist = async (productId: string): Promise<WishlistItem> => {
  const res = await api.post("/wishlist/add", { productId });
  return res.data;
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  await api.delete(`/wishlist/remove/${productId}`);
};
