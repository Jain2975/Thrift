import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { User, LogOut, ShoppingCart, LayoutDashboardIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white/80 backdrop-blur border-b shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        Thrift Commerce
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <Link to="/dashboard">
          <LayoutDashboardIcon className="w-6 h-6  text-gray-700 hover:text-blue-600 cursor-pointer"></LayoutDashboardIcon>
        </Link>
        {/* Cart Icon */}
        <Link to="/cart">
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600 cursor-pointer" />
        </Link>

        {/* User Section */}
        {user ? (
          <div className="relative">
            {/* Avatar Button */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
            >
              <User className="w-5 h-5" />
              <span className="text-sm">{user.name}</span>
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Profile
                </Link>

                <button
                  onClick={async () => {
                    await logout();
                    setOpen(false);
                    navigate("/");
                  }}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-100 text-red-600 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm transition"
          >
            Login / Register
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
