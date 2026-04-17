import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getProductReviews, createReview, createReport, createConversation } from "../../services/productServices";
import type { Product } from "../../services/productServices";
import { AddItemToCart } from "../../services/cartServices";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { Star, MessageCircle, AlertTriangle, ShoppingCart } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Report Modal state
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("SPAM");
  const [reportDetails, setReportDetails] = useState("");

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (productId: string) => {
    try {
      const prodData = await getProductById(productId);
      setProduct(prodData);
      const revData = await getProductReviews(productId);
      setReviews(revData);
    } catch (error) {
      toast.error("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await AddItemToCart(product.id, 1);
      toast.success("Added to Cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await createReview(id, rating, comment);
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      loadData(id);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit review");
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await createReport(id, reportReason, reportDetails);
      toast.success("Report submitted to Admin.");
      setShowReport(false);
      setReportDetails("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit report");
    }
  };

  const handleChatWithSeller = async () => {
    if (!product || !product.sellerId) return;
    try {
      const conversation = await createConversation(product.sellerId);
      // For now we just alert, later we will redirect or open the Chat widget
      toast.success("Conversation created/found!");
      // window.dispatchEvent(new CustomEvent('openChat', { detail: conversation.id }));
    } catch (error) {
      toast.error("Failed to initiate chat");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!product) return <div className="p-10 text-center">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT: Image */}
      <div>
        <img
          src={`http://localhost:3000${product.imageUrl}`}
          alt={product.name}
          className="w-full h-96 object-cover rounded-xl shadow border border-gray-100"
        />
      </div>

      {/* RIGHT: Details */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-2 text-xl font-semibold text-blue-600">₹{product.price}</p>

        <p className={`mt-2 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>

        <p className="mt-4 text-gray-600 leading-relaxed border-b pb-6 border-gray-200">
          {product.description || "No description provided."}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 py-3 px-6 rounded-lg text-white font-medium flex justify-center items-center gap-2 ${product.stock > 0 ? "bg-blue-600 hover:bg-blue-700 shadow shadow-blue-200" : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>

          <button
            onClick={handleChatWithSeller}
            className="flex-1 py-3 px-6 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium flex justify-center items-center gap-2 transition"
          >
            <MessageCircle className="w-5 h-5" />
            Chat with Seller
          </button>

          <button
            onClick={() => setShowReport(true)}
            className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center justify-center transition"
            title="Report this product"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>

          {user ? (
            <form onSubmit={handleCreateReview} className="mb-8 bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-2">Write a review</h3>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What do you think about this product?"
                className="w-full p-3 rounded-lg border border-gray-200 mb-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
              />
              <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium">
                Submit Review
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 mb-6">Please log in to leave a review.</p>
          )}

          <div className="flex flex-col gap-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet.</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{rev.user?.name || "User"}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" /> Report Product
            </h3>
            <form onSubmit={handleReport}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="SPAM">Spam / Misleading</option>
                  <option value="FRAUD">Fraud / Scam</option>
                  <option value="COUNTERFEIT_ITEM">Counterfeit Item</option>
                  <option value="INAPPROPRIATE_CONTENT">Inappropriate Content</option>
                  <option value="WRONG_CATEGORY">Wrong Category</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Details (optional)</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide more context..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  rows={4}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowReport(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
