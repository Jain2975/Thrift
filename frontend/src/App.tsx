// import Home from "./components/Home";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// function App(){
//  return (
//     <div>
//         <Header />
//         <Home />
//         <Footer />
//     </div>
//  )
// }

// export default App;
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Route,Routes } from "react-router-dom";
function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
