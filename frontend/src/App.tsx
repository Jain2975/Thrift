import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CartPage from "./components/Cart/CartPage";
import ProtectedRoute from "./ProtectedRoute";
import UserProfile from "./components/Profile/UserProfile";
import CreateProduct from "./components/products/CreateProduct";
import WishlistPage from "./components/Profile/WishlistPage";
import ProductDetails from "./components/products/ProductDetails";
import AdminApprovals from "./components/admin/AdminApprovals";
import AdminReports from "./components/admin/AdminReports";
import AdminOrders from "./components/admin/AdminOrders";
import ChatWidget from "./components/chat/ChatWidget";
import SellerDashboard from "./components/seller/SellerDashboard";

function App() {
  return (
    <>
      <Routes>
      {/* Main site layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute>
              <AdminApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/upload-product"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        ></Route>
      </Route>
      {/* Auth pages layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
    <ChatWidget />
    </>
  );
}

export default App;
