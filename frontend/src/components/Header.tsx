import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white/80 backdrop-blur border-b shadow-sm sticky top-0 z-50">

      <Link to="/" className="text-xl font-bold text-blue-600">
        Thrift Commerce
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-slate-600">
              Hello, {user.name}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm transition"
          >
            Login
          </Link>
        )}
      </div>

    </header>
  );
};

export default Header;
