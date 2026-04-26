import { type Product } from "../../services/productServices";
import { AddItemToCart } from "../../services/cartServices";
import { deleteProduct, restoreProduct } from "../../services/productServices";
import { toast } from "react-toastify";
import { Heart, ShoppingCart, Trash2, ArchiveRestore, Info } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";

const ProductCard = ({
  product,
  onUpdate,
  isFavorite = false,
  onToggleFavorite,
}: {
  product: Product;
  onUpdate: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string, currentStatus: boolean) => void;
}) => {
  const { user } = useAuth();

  const handleAddToCart = async () => {
    try {
      await AddItemToCart(product.id, 1);
      console.log("Added Product To Card");
      toast.success("Item Added to Cart");
    } catch (err) {
      console.error("Failed To Add to Cart", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      onUpdate({ ...product, isDeleted: true });
      toast.success("Product Deleted Successfully");
    } catch (err) {
      console.error("Failed To Delete Product", err);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreProduct(product.id);
      onUpdate({ ...product, isDeleted: false });
      toast.success("Product Restored Successfully");
    } catch (err) {
      console.error("Failed To Restore Product", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <div className="relative">
        {(product.imageUrl || product.thumbnailUrl) && (
          <img
            src={`http://localhost:3000${product.thumbnailUrl ?? product.imageUrl}`}
            alt={product.name}
            className="h-40 w-full object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/400x300?text=No+Image";
              e.currentTarget.onerror = null;
            }}
          />
        )}

        {product.isDeleted && (
          <div className="absolute inset-0 bg-red-600/10 bg-opacity-50 flex items-center justify-center rounded">
            <span className="text-white text-lg font-bold">Deleted</span>
          </div>
        )}
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(product.id, isFavorite)}
            className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition flex items-center justify-center"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        )}
      </div>

      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">
        {product.description}
      </p>

      <div className="flex justify-between items-center mt-2">
        <p className="font-bold text-blue-600">₹{product.price}</p>
        <p className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-500 font-bold"}`}>
          {product.stock > 0 ? `${product.stock} items left` : "Out of stock"}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 flex justify-center items-center gap-2 ${product.stock > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white py-2 rounded-lg transition`}
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Add</span>
          </button>
          <Link
            to={`/product/${product.id}`}
            className="flex-1 flex justify-center items-center gap-2 bg-gray-100 text-gray-700 border border-gray-200 py-2 rounded-lg hover:bg-gray-200 transition"
            title="View Details"
          >
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">Details</span>
          </Link>
        </div>

        {user && (user.role === 'ADMIN' || user.role === 'SELLER') && (
          !product.isDeleted ? (
            <button
              onClick={handleDelete}
              className="flex-1 flex justify-center items-center gap-2 bg-red-50 text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-100 hover:text-red-700 transition"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Delete</span>
            </button>
          ) : (
            <button
              onClick={handleRestore}
              className="flex-1 flex justify-center items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 py-2 rounded-lg hover:bg-emerald-100 transition"
              title="Restore"
            >
              <ArchiveRestore className="w-4 h-4" />
              <span className="text-sm font-medium">Restore</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ProductCard;
