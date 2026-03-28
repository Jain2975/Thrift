import { useAuth } from "../Context/AuthContext";
import ProductList from "../components/products/ProductList";
import { motion } from "framer-motion";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="pt-28 pb-10 px-6 max-w-7xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Dashboard</h1>
        <p className="text-lg text-slate-500 font-medium mb-12">
          Welcome back, <span className="text-blue-600 font-bold">{user?.name}</span>. Ready to explore?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <ProductList />
      </motion.div>
    </div>
  );
}

export default Dashboard;
