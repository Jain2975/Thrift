import React, { useState, useEffect } from "react";
import { getSellerProducts } from "../../services/productServices";
import { getSellerOrders } from "../../services/orderServices";
import EditProductModal from "./EditProductModal";
import { Package, ShoppingBag, Edit, LayoutDashboard } from "lucide-react";
import { toast } from "react-toastify";

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prodData, orderData] = await Promise.all([
        getSellerProducts(1, 100),
        getSellerOrders(),
      ]);
      setProducts(prodData.products);
      setOrders(orderData);
    } catch (error) {
      toast.error("Failed to load seller data");
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdated = () => {
    setEditingProduct(null);
    loadDashboardData();
  };

  if (loading) return <div className="p-10 text-center text-xl font-semibold">Loading Dashboard...</div>;

  const totalSales = orders.reduce((sum, order) => {
    const itemSum = order.items.reduce((acc: number, item: any) => acc + Number(item.price) * item.quantity, 0);
    return sum + itemSum;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Seller Hub</h2>
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "overview" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
        >
          <LayoutDashboard className="w-5 h-5" /> Overview
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "products" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
        >
          <Package className="w-5 h-5" /> My Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "orders" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}
        >
          <ShoppingBag className="w-5 h-5" /> My Orders
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
        {activeTab === "overview" && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-sm">
                <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">Total Products</p>
                <p className="text-4xl font-extrabold text-blue-900">{products.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-sm">
                <p className="text-green-600 text-sm font-bold uppercase tracking-wider mb-2">Total Earnings</p>
                <p className="text-4xl font-extrabold text-green-900">₹{totalSales.toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-sm">
                <p className="text-purple-600 text-sm font-bold uppercase tracking-wider mb-2">Total Orders</p>
                <p className="text-4xl font-extrabold text-purple-900">{orders.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">My Products</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-700 text-sm font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {products.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">No products found. Add some!</td></tr>
                  ) : (
                    products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="p-4">
                          <img src={`http://localhost:3000${p.imageUrl}`} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                        </td>
                        <td className="p-4 font-medium text-gray-800">{p.name}</td>
                        <td className="p-4 font-semibold text-blue-600">₹{p.price}</td>
                        <td className="p-4">{p.stock}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : p.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {p.approvalStatus}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => setEditingProduct(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Orders containing your items</h3>
            <div className="flex flex-col gap-4">
              {orders.length === 0 ? (
                <div className="text-center p-8 text-gray-500 border border-dashed border-gray-300 rounded-xl">No orders yet.</div>
              ) : (
                orders.map((order: any) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
                    <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-3">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Order ID</p>
                        <p className="font-mono text-gray-800 text-xs mt-1">{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 font-medium">Date</p>
                        <p className="font-semibold text-sm text-gray-800 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                           <img src={`http://localhost:3000${item.product?.imageUrl}`} alt="Product" className="w-12 h-12 rounded object-cover" />
                           <div className="flex-1">
                              <p className="font-medium text-gray-800">{item.product?.name || "Unknown Product"}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                           </div>
                           <div className="font-bold text-gray-800">
                             ₹{(Number(item.price) * item.quantity).toFixed(2)}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {editingProduct && (
        <EditProductModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onSuccess={handleProductUpdated} 
        />
      )}
    </div>
  );
}
