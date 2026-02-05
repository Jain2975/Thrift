import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getCart,
  DeleteCartItem,
  UpdateCartItem,
  ClearCart,
  type Cart,
} from "../../services/cartServices.ts";

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

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">Your cart is empty</p>
    );
  }
  const addhandleUpdateCartItem = async (itemId: string, quantity: number) => {
    try {
      const updatedItem = await UpdateCartItem(itemId, quantity);
      toast("Item Quantity Increased");
      setCart((prevCart) => {
        if (!prevCart) return prevCart;

        return {
          ...prevCart,
          items: prevCart.items.map((item) =>
            item.id === updatedItem.id
              ? { ...item, quantity: updatedItem.quantity }
              : item,
          ),
        };
      });

      console.log("Item Updated successfully in Cart");
    } catch (error) {
      toast.error("Error updating item quantity");
      console.error("Error updating cart item", error);
    }
  };
  const subhandleUpdateCartItem = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        handleDeleteCartItem(itemId);
        return;
      }
      const updatedItem = await UpdateCartItem(itemId, quantity);
      toast("Item Quantity decreased");
      setCart((prevCart) => {
        if (!prevCart) return prevCart;

        return {
          ...prevCart,
          items: prevCart.items.map((item) =>
            item.id === updatedItem.id
              ? { ...item, quantity: updatedItem.quantity }
              : item,
          ),
        };
      });

      console.log("Item Updated successfully in Cart");
    } catch (error) {
      console.error("Error updating cart item", error);
    }
  };
  const handleDeleteCartItem = async (itemId: string) => {
    try {
      await DeleteCartItem(itemId);
      toast.error("Item deleted successfully");
      setCart((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          items: prev.items.filter((item) => item.id !== itemId),
        };
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCart = async () => {
    try {
      const res = await ClearCart();
      setCart(null);
      console.log("Cart cleared ");
    } catch (error) {
      console.error("Error deleting cart", error);
    }
  };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h2>
      <button
        onClick={handleDeleteCart}
        className="bg-neutral-700 text-white rounded mb-1.5 p-1"
      >
        Clear Cart
      </button>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-48 h-48 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{item.product.name}</p>
              <p className="text-gray-500">Quantity: {item.quantity}</p>
              <p className="font-bold text-blue-600 mt-1">
                ₹{item.product.price}
              </p>
            </div>
            {/* Placeholder for future buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() =>
                  addhandleUpdateCartItem(item.id, item.quantity + 1)
                }
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
              >
                +
              </button>
              <button
                onClick={() =>
                  subhandleUpdateCartItem(item.id, item.quantity - 1)
                }
                className="bg-red-100 text-white px-3 py-1 rounded hover:bg-green-600 transition"
              >
                -
              </button>
              <button
                onClick={() => handleDeleteCartItem(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Optional footer total section */}
      <div className="mt-6 flex justify-end items-center">
        <p className="text-lg font-semibold text-gray-800">
          Total: ₹
          {cart.items.reduce(
            (sum, item) => sum + Number(item.product.price) * item.quantity,
            0,
          )}
        </p>
      </div>
    </div>
  );
};

export default CartPage;
