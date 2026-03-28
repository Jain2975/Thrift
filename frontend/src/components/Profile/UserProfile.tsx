import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import ShowOrders from "./ShowOrders";
import { motion } from "framer-motion";
import { Store, User, Loader2 } from "lucide-react";

function UserProfile() {
  const { user, updateUserRole } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRoleToggle = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const newRole = user.role === "SELLER" ? "USER" : "SELLER";
      await updateUserRole(newRole);
    } catch (err) {
      console.error("Failed to update role", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-10 px-6 max-w-5xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row gap-6 mb-8"
      >
        {/* Profile Card */}
        <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-extrabold text-white shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Hello, {user?.name}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Welcome back! Here’s a summary of your thrift finds 🛍️
            </p>
            <span className="inline-block mt-3 px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-widest shadow-sm">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Seller Upgrade Card */}
        {user?.role !== "ADMIN" && (
          <div className="md:w-80 shrink-0 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-8 flex flex-col justify-center items-center text-center">
            {user?.role === "SELLER" ? (
              <>
                <Store className="w-10 h-10 text-indigo-500 mb-3" />
                <h3 className="text-xl font-bold text-slate-800">Seller Dashboard Active</h3>
                <p className="text-sm text-slate-500 mt-2 mb-5">You are authorized to sell items on the marketplace.</p>
                <button 
                  onClick={handleRoleToggle}
                  disabled={loading}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 w-full justify-center"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Demote to User
                </button>
              </>
            ) : (
              <>
                <User className="w-10 h-10 text-blue-500 mb-3" />
                <h3 className="text-xl font-bold text-slate-800">Want to sell items?</h3>
                <p className="text-sm text-slate-500 mt-2 mb-5">Upgrade your account for free to start listing your own products.</p>
                <button 
                  onClick={handleRoleToggle}
                  disabled={loading}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2 w-full justify-center"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Become a Seller
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>

      {/* Orders Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-8"
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Your Orders
        </h2>
        <ShowOrders />
      </motion.div>
    </div>
  );
}

export default UserProfile;
