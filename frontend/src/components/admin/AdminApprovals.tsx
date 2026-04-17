import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdminApprovals() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/admin?status=PENDING");
      // res.data contains { products: [], total: ... }
      setProducts(res.data.products);
    } catch (error) {
      toast.error("Failed to fetch pending products.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/products/approve/${id}`);
      toast.success("Product Approved");
      fetchPendingProducts();
    } catch (error) {
      toast.error("Failed to approve product");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.post(`/products/reject/${id}`);
      toast.success("Product Rejected");
      fetchPendingProducts();
    } catch (error) {
      toast.error("Failed to reject product");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading pending products...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Approvals</h1>
      
      {products.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
          <p className="text-gray-500">No products pending approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              <img 
                src={`http://localhost:3000${product.imageUrl}`} 
                alt={product.name} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-blue-600">₹{product.price}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                    {product.stock} items
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(product.id)}
                    className="flex-1 flex justify-center items-center gap-1 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg hover:bg-green-100 transition font-medium"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(product.id)}
                    className="flex-1 flex justify-center items-center gap-1 bg-red-50 text-red-700 border border-red-200 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
