import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { User, LogOut, ShoppingCart, LayoutDashboardIcon, ChevronDown, UploadCloud, UserCircle, Heart, ShieldCheck, AlertTriangle, Package } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 pointer-events-none">
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="max-w-7xl mx-auto rounded-full bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg shadow-blue-500/5 pointer-events-auto"
      >
        <div className="flex justify-between items-center px-6 py-3">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-full shadow-md group-hover:shadow-blue-500/30 transition-shadow">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Thrift
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-6">
            <Link to="/dashboard" className="p-2 rounded-full hover:bg-black/5 transition-colors group">
              <LayoutDashboardIcon className="w-6 h-6 text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
            </Link>
            
            {/* Cart Icon */}
            <Link to="/cart" className="p-2 rounded-full hover:bg-black/5 transition-colors group">
              <ShoppingCart className="w-6 h-6 text-slate-600 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
            </Link>
            
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="p-2 rounded-full hover:bg-black/5 transition-colors group">
              <Heart className="w-6 h-6 text-slate-600 group-hover:text-red-500 group-hover:scale-110 transition-all" />
            </Link>

            {/* User Section */}
            {user ? (
              <div className="relative ml-2" ref={dropdownRef}>
                {/* Avatar Button */}
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 pl-2 pr-3 py-1.5 rounded-full transition-all active:scale-95"
                >
                  <div className="bg-gradient-to-tr from-blue-500 to-indigo-400 rounded-full p-1 shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Popover with Framer Motion */}
                <AnimatePresence>
                  {open && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-3xl shadow-2xl rounded-2xl border border-white/50 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="p-2 flex flex-col gap-1">
                        <Link
                          to="/profile"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-xl text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors"
                        >
                          <UserCircle className="w-4 h-4 text-slate-400" />
                          Profile
                        </Link>
                        {(user.role === "ADMIN" || user.role === "SELLER") && (
                          <Link
                            to="/upload-product"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50 rounded-xl text-sm font-medium text-slate-700 hover:text-indigo-700 transition-colors"
                          >
                            <UploadCloud className="w-4 h-4 text-slate-400" />
                            Upload Product
                          </Link>
                        )}
                        {user.role === "ADMIN" && (
                          <>
                            <Link
                              to="/admin/approvals"
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 rounded-xl text-sm font-medium text-slate-700 hover:text-green-700 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-slate-400" />
                              Approvals
                            </Link>
                            <Link
                              to="/admin/reports"
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl text-sm font-medium text-slate-700 hover:text-red-700 transition-colors"
                            >
                              <AlertTriangle className="w-4 h-4 text-slate-400" />
                              Reports
                            </Link>
                            <Link
                              to="/admin/orders"
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-amber-50 rounded-xl text-sm font-medium text-slate-700 hover:text-amber-700 transition-colors"
                            >
                              <Package className="w-4 h-4 text-slate-400" />
                              Orders
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                        <button
                          onClick={async () => {
                            await logout();
                            setOpen(false);
                            navigate("/");
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-red-50 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-full text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </motion.header>
    </div>
  );
};

export default Header;
