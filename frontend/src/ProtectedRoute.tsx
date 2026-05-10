import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import { toast } from "react-toastify";
import { useRef } from "react";

interface Props {
  children: React.ReactNode;
  allowedRoles?: Array<"USER" | "ADMIN" | "SELLER">;
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, loading } = useAuth();
  const toastShown = useRef(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (!toastShown.current) {
      toastShown.current = true;
      toast.error(`Access denied — this page is for ${allowedRoles.join(" / ")} only.`);
    }
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;

