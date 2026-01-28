import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

interface Props{
    children : React.ReactNode;

}

const ProtectedRoute = ({ children }: Props) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;