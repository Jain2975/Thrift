import { useState, useEffect } from "react";
import { getOrderHistory } from "../../services/userServices";
import type { Order } from "../../services/userServices";
import OrderCard from "./OrderCard";

function ShowOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const resp = await getOrderHistory();
        setOrders(resp.data);
      } catch (err) {
        console.error("Cannot get user order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700">No Orders Yet</h3>
        <p className="text-sm text-gray-500 mt-2">
          Your thrift finds will show up here once you place an order.
        </p>
        <button className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

export default ShowOrders;
