import type { Order } from "../../services/userServices";

type Props = {
  order: Order;
};

function OrderCard({ order }: Props) {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Order #{order.id}</h3>
        <span className="text-sm text-gray-500">{order.status}</span>
      </div>

      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>₹{item.price}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-right font-semibold">Total: ₹{order.total}</div>
    </div>
  );
}

export default OrderCard;
