import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative items-center justify-center">
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>
      <Outlet />
    </div>
  );
}
