import api from "../api/axios";

export type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    imageUrl?: string;
  };
};

export type Cart = {
  id: string;
  items: CartItem[];
};

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const AddItemToCart = async (productId: string, quantity = 1) => {
  const res = await api.post("/cart/items", {
    productId,
    quantity,
  });
  return res.data;
};

export const UpdateCartItem = async (itemId: string, quantity = 1) => {
  const res = await api.patch(`/cart/items/:${itemId}`, {
    itemId,
    quantity,
  });
  return res.data;
};

export const DeleteCartItem = async (itemId: string) => {
  const res = await api.delete(`/cart/items/${itemId}`, {
    data: { itemId },
  });
  return res.data;
};
export const ClearCart = async () => {
  const res = await api.delete("/cart");
  return res.data;
};
