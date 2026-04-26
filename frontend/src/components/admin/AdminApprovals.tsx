import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import {
  CheckCircle,
  XCircle,
  ZoomIn,
  X,
  Flag,
  Clock,
  AlertTriangle,
  User,
} from "lucide-react";

type TabStatus = "PENDING" | "FLAGGED";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  stock: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  category?: string;
  approvalStatus: string;
  seller?: { name?: string; email?: string };
  _count?: { reports?: number };
}

export default function AdminApprovals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabStatus>("PENDING");
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const fetchProducts = useCallback(async (status: TabStatus) => {
    try {
      setLoading(true);
      const res = await api.get(`/products/admin?status=${status}`);
      setProducts(res.data.products ?? []);
    } catch {
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(tab);
  }, [tab, fetchProducts]);

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/products/approve/${id}`);
      toast.success("Product approved ✓");
      fetchProducts(tab);
    } catch {
      toast.error("Failed to approve product");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.post(`/products/reject/${id}`);
      toast.success("Product rejected");
      fetchProducts(tab);
    } catch {
      toast.error("Failed to reject product");
    }
  };

  const tabStyles = (active: boolean) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
      active
        ? "bg-gray-900 text-white shadow"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 mt-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Approvals</h1>
      <p className="text-gray-500 text-sm mb-6">
        Review, approve or reject product listings before they go live.
      </p>

      {/* ── Tab Switcher ────────────────────────────────────────── */}
      <div className="flex gap-3 mb-8">
        <button
          id="tab-pending"
          className={tabStyles(tab === "PENDING")}
          onClick={() => setTab("PENDING")}
        >
          <Clock className="w-4 h-4" />
          Pending Review
        </button>
        <button
          id="tab-flagged"
          className={tabStyles(tab === "FLAGGED")}
          onClick={() => setTab("FLAGGED")}
        >
          <Flag className="w-4 h-4" />
          Flagged
        </button>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400 gap-2">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
          Loading…
        </div>
      ) : products.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">{tab === "PENDING" ? "📋" : "🏳️"}</div>
          <p className="text-gray-500 font-medium">
            No {tab.toLowerCase()} products right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const imgSrc = `http://localhost:3000${product.imageUrl ?? product.thumbnailUrl}`;
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition"
              >
                {/* Image with zoom button */}
                <div className="relative group">
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/400x300?text=No+Image";
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <button
                    id={`zoom-${product.id}`}
                    onClick={() => setZoomImage(imgSrc)}
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="Zoom image"
                  >
                    <ZoomIn className="w-8 h-8 text-white drop-shadow" />
                  </button>

                  {/* Status badge */}
                  <span
                    className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full ${
                      tab === "FLAGGED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {tab === "FLAGGED" ? (
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Flagged
                      </span>
                    ) : (
                      "Pending"
                    )}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
                    {product.description || "No description"}
                  </p>

                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-blue-600">₹{product.price}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {product.stock} in stock
                    </span>
                  </div>

                  {product.category && (
                    <span className="text-xs text-gray-400 mb-2">
                      Category: {product.category}
                    </span>
                  )}

                  {/* Seller info */}
                  {product.seller && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 bg-gray-50 rounded-lg px-3 py-2">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-medium">{product.seller.name ?? "Unknown"}</span>
                      {product.seller.email && (
                        <span className="text-gray-400">· {product.seller.email}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      id={`approve-${product.id}`}
                      onClick={() => handleApprove(product.id)}
                      className="flex-1 flex justify-center items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 py-2 rounded-xl hover:bg-emerald-100 transition font-semibold text-sm"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      id={`reject-${product.id}`}
                      onClick={() => handleReject(product.id)}
                      className="flex-1 flex justify-center items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 py-2 rounded-xl hover:bg-red-100 transition font-semibold text-sm"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Image Zoom Modal ──────────────────────────────────────── */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="zoom-close"
              onClick={() => setZoomImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
            >
              <X className="w-7 h-7" />
            </button>
            <img
              src={zoomImage}
              alt="Full size preview"
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/800x600?text=No+Image";
                e.currentTarget.onerror = null;
              }}
            />
            <p className="text-center text-gray-400 text-xs mt-3">
              Click outside or ✕ to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
