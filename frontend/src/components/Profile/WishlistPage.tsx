import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { getWishlist, removeFromWishlist } from "../../services/wishlistServices";
import ProductCard from "../products/ProductCard";
import { type Product } from "../../services/productServices";
import { HeartCrack, Heart } from "lucide-react";
import { toast } from "react-toastify";

const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      // data.items gives the WishlistItems which include the nested .product
      const wishlistProducts = data.items.map((item: any) => item.product);
      setProducts(wishlistProducts);
    } catch (error) {
      console.error("Failed to load wishlist", error);
      toast.error("Could not load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUpdateProduct = (updatedProduct: Product) => {
    // Optimistic UI updates shouldn't be generally needed for removing as it's handled via the heart toggle, but kept for consistency
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleToggleFavorite = async (productId: string, isCurrentlyFavorite: boolean) => {
    if (isCurrentlyFavorite) {
      try {
        await removeFromWishlist(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast.success("Removed from wishlist");
      } catch (err) {
        toast.error("Failed to remove from wishlist");
      }
    }
  };

  if (!user) {
    return (
      <div className="pt-24 min-h-[70vh] flex flex-col items-center justify-center">
        <Heart className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700">Please Sign In</h2>
        <p className="text-slate-500 mt-2">You need to log in to view your wishlist.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 mb-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
        <h1 className="text-3xl font-extrabold text-slate-800">My Wishlist</h1>
        <span className="bg-slate-100 text-slate-600 font-medium py-1 px-3 rounded-full text-sm">
          {products.length} Items
        </span>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdate={handleUpdateProduct}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="min-h-[40vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <HeartCrack className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 max-w-md">
            Looks like you haven't added anything to your wishlist yet. Explore our products and tap the heart icon to save items for later!
          </p>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
