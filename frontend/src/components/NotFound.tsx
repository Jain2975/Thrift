import { Link } from "react-router-dom";
import { ShoppingCart, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 text-center">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 rounded-full shadow-lg mb-6">
        <ShoppingCart className="w-12 h-12 text-white" />
      </div>

      <h1 className="text-8xl font-extrabold text-blue-600 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">Page Not Found</h2>
      <p className="text-slate-500 max-w-md mb-8">
        Looks like this page went out of stock. The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-md shadow-blue-500/25 hover:shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}
