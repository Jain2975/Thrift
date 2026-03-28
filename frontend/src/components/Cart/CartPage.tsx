import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  X,
  CreditCard,
  Wallet,
  Banknote,
  Loader2,
} from "lucide-react";

import {
  getCart,
  DeleteCartItem,
  UpdateCartItem,
  ClearCart,
  type Cart,
} from "../../services/cartServices.ts";
import { checkoutOrder } from "../../services/orderServices.ts";

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  // checkout states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

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
      <div className="flex items-center justify-center min-h-[65vh]">
        <p className="text-gray-500 text-lg">Your cart is empty</p>
      </div>
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
      await ClearCart();
      setCart({ ...cart, items: [] });
      console.log("Cart cleared ");
    } catch (error) {
      console.error("Error deleting cart", error);
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
  };

  const handleProcessPayment = async () => {
    setProcessingPayment(true);
    try {
      //Simulate network delay for payment gateway
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await checkoutOrder();

      //Show success animation
      setProcessingPayment(false);
      setTransactionSuccess(true);
      toast.success("Transaction Completed Successfully!");

      //Close modal and clear cart off-screen after a slight delay
      setTimeout(() => {
        setShowPaymentModal(false);
        setTransactionSuccess(false);
        setCart({ ...cart, items: [] });
      }, 2500);
    } catch (error) {
      console.error("Payment processing failed", error);
      toast.error("Failed to process order.");
      setProcessingPayment(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-[70vh] relative">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h2>
      <button
        onClick={handleDeleteCart}
        className="bg-neutral-700 text-white rounded mb-4 px-3 py-1 hover:bg-neutral-800 transition"
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
              src={item.product.imageUrl || ""}
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
                className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 transition"
              >
                -
              </button>
              <button
                onClick={() => handleDeleteCartItem(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Footer / Checkout Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center">
        <p className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">
          Total: <span className="text-blue-600">₹{calculateTotal()}</span>
        </p>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-md"
        >
          Buy Now
        </button>
      </div>

      {/* Payment Modal Overlay */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative pb-6 transform transition-all scale-100">
            {/* Modal Header */}
            {!transactionSuccess && !processingPayment && (
              <>
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 className="text-xl font-bold text-gray-800">
                    Select Payment Method
                  </h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Payment Options */}
                <div className="p-6 space-y-4">
                  <button
                    onClick={handleProcessPayment}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition group"
                  >
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                      <CreditCard size={24} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-800">
                        Credit / Debit Card
                      </p>
                      <p className="text-sm text-gray-500">
                        Pay securely with your card
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleProcessPayment}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition group"
                  >
                    <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                      <Wallet size={24} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-800">
                        UPI / Wallets
                      </p>
                      <p className="text-sm text-gray-500">
                        Google Pay, PhonePe, Paytm
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleProcessPayment}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 transition group"
                  >
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                      <Banknote size={24} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-800">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-gray-500">
                        Pay when your order arrives
                      </p>
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* Processing State */}
            {processingPayment && !transactionSuccess && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <Loader2
                  size={64}
                  className="text-blue-600 animate-spin mb-4"
                />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Processing Payment...
                </h3>
                <p className="text-gray-500">Please do not close this window</p>
              </div>
            )}

            {/* Success State */}
            {transactionSuccess && (
              <div className="p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-green-100 text-green-500 rounded-full p-4 mb-6">
                  <CheckCircle2 size={80} />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  Transaction Completed
                </h3>
                <p className="text-gray-600 font-medium">
                  Your order has been placed successfully!
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  Redirecting back to cart...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
