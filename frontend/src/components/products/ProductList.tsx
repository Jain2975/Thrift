import { useEffect, useState, useCallback } from "react";
import { getAllProducts, type Product } from "../../services/productServices";
import { getWishlist, addToWishlist, removeFromWishlist } from "../../services/wishlistServices";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { Search, Filter } from "lucide-react";

const ProductList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Handle other filter change resets
  const handleFilterChange = () => setPage(1);

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const minP = minPrice ? Number(minPrice) : undefined;
      const maxP = maxPrice ? Number(maxPrice) : undefined;
      const includeDeleted = user?.role === 'ADMIN' || user?.role === 'SELLER';
      
      const data = await getAllProducts(page, 12, minP, maxP, category || undefined, debouncedSearch || undefined, sortBy, includeDeleted);
      setProducts(data.products || []); // Ensure products is always an array
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setProducts([]); // Fallback
    } finally {
      setLoading(false);
    }
  }, [page, minPrice, maxPrice, category, debouncedSearch, sortBy, user]);

  const fetchUserWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getWishlist();
      const ids = new Set(data.items.map((item: any) => item.productId));
      setWishlistIds(ids);
    } catch (err) {
      console.error("Failed to load wishlist", err);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchUserWishlist();
  }, [fetchUserWishlist]);

  const handleToggleFavorite = async (productId: string, isCurrentlyFavorite: boolean) => {
    if (!user) {
      toast.info("Please login to add to wishlist");
      return;
    }
    try {
      if (isCurrentlyFavorite) {
        await removeFromWishlist(productId);
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.add(productId);
          return next;
        });
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-fit">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-800">Filters</h2>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">Search</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">Price Range (₹)</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); handleFilterChange(); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
            <span className="text-slate-400">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); handleFilterChange(); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">Category</label>
          <select 
            value={category}
            onChange={(e) => { setCategory(e.target.value); handleFilterChange(); }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
          >
            <option value="">All Categories</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Books">Books</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">Sort By</label>
          <select 
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); handleFilterChange(); }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onUpdate={handleUpdateProduct}
                  isFavorite={wishlistIds.has(product.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-400 py-20">
            <Search className="w-16 h-16 mb-4 text-slate-200" />
            <p className="text-lg font-medium text-slate-600">No products found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
