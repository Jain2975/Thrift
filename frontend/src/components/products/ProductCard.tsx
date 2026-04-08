import { type Product } from "../../services/productServices";
import { AddItemToCart } from "../../services/cartServices";
import { deleteProduct, restoreProduct } from "../../services/productServices";
import { toast } from "react-toastify";
import { Heart, ShoppingCart, Trash2, ArchiveRestore } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";

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
        {product.imageUrl && (
          <img
            src={`http://localhost:3000${product.imageUrl}`}
            alt={product.name}
            className="h-40 w-full object-cover rounded"
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

      <p className="mt-2 font-bold text-blue-600">₹{product.price}</p>
      
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          title="Add to Cart"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-sm font-medium">Add</span>
        </button>

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
