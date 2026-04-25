import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/order/admin");
      setOrders(res.data.orders || []);
    } catch (error) {
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/order/admin/${id}/status`, { status: newStatus });
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
          <p className="text-gray-500">No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user?.name || "Unknown"} <br/>
                    <span className="text-xs text-gray-400">{order.user?.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ₹{order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        order.status === "pending" ? "text-yellow-600 bg-yellow-50" :
                        order.status === "paid" ? "text-blue-600 bg-blue-50" :
                        order.status === "shipped" ? "text-indigo-600 bg-indigo-50" :
                        order.status === "delivered" ? "text-green-600 bg-green-50" :
                        "text-red-600 bg-red-50"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
