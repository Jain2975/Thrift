import React from "react";
import { useAuth } from "../../Context/AuthContext";
import ShowOrders from "./ShowOrders";

function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Profile Card */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-semibold text-emerald-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-semibold text-gray-800">
              Hello, {user?.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back! Here’s a summary of your thrift finds 🛍️
            </p>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Orders
          </h2>

          <ShowOrders />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
