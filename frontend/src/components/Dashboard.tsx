import { useAuth } from "../Context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg text-gray-700">Welcome, {user?.name}</p>
    </div>
  );
}

export default Dashboard;
