import { type Product } from "../../services/productServices";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
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
        // onClick={() => onAddToCart(product.id)}
        className="mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
