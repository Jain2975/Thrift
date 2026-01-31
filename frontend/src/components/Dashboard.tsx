import { useAuth } from "../Context/AuthContext";
import ProductList from "../components/products/ProductList";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user?.name}</p>

      <ProductList />
    </div>
  );
}

export default Dashboard;
