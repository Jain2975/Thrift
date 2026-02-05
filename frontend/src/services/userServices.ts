import api from "../api/axios";
export type OrderItem = {
  id: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    name: string;
    price: string;
    imageUrl?: string | null;
  };
};

export type Order = {
  id: string;
  total: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
};
export const getOrderHistory = async () => {
  const res = await api.get<Order[]>("/user/orders");
  return res;
};
