function ShowOrders() {
  return (
    <div className="space-y-4">
      {/* Empty State Card */}
      <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700">No Orders Yet</h3>

        <p className="text-sm text-gray-500 mt-2">
          Your thrift finds will show up here once you place an order.
        </p>

        <button className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition">
          Start Shopping
        </button>
      </div>
    </div>
  );
}

export default ShowOrders;
