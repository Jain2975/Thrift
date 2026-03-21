import { type Product } from "../../services/productServices";
import { AddItemToCart } from "../../services/cartServices";
import { deleteProduct, restoreProduct } from "../../services/productServices";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: Product }) => {
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
      toast.success("Product Deleted Successfully");
    } catch (err) {
      console.error("Failed To Delete Product", err);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreProduct(product.id);
      toast.success("Product Restored Successfully");
    } catch (err) {
      console.error("Failed To Restore Product", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      {product.imageUrl && (
        <img
          src={`http://localhost:3000${product.imageUrl}`}
          alt={product.name}
          className="h-40 w-full object-cover rounded"
        />
      )}

      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">
        {product.description}
      </p>

      <p className="mt-2 font-bold text-blue-600">₹{product.price}</p>
      <button
        onClick={handleAddToCart}
        className="mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition p-1px"
      >
        Add
      </button>
      <button
        onClick={handleDelete}
        className="mt-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition p-1px"
      >
        Delete
      </button>
      <button
        onClick={handleRestore}
        className="mt-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition p-1px"
      >
        Restore
      </button>
    </div>
  );
};

export default ProductCard;
