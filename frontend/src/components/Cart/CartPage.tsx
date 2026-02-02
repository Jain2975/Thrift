import { useEffect, useState } from "react";
import { getCart, type Cart } from "../../services/cartServices.ts";
import { type Product } from "../../services/productServices.ts";

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) return <p>Loading cart...</p>;

  if (!cart || cart.items.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

      {cart.items.map((item) => (
        <div key={item.id} className="flex gap-4 mb-4">
          <img src={item.product.imageUrl} className="w-20 h-20 object-cover" />
          <div>
            <p>{item.product.name}</p>
            <p>Qty: {item.quantity}</p>
            <p>₹{item.product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartPage;
