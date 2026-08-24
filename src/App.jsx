import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import PatronDashboard from "./pages/PatronDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page seen FIRST before login page */}
          <Route path="/" element={<Landing />} />

          {/* Login Page with Admin, Staff, and Patron Gmail tabs */}
          <Route
            path="/login"
            element={
              <>
                <Landing />
                <Login overlay />
              </>
            }
          />

          {/* Protected Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Staff Dashboard */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Patron Dashboard / Home */}
          <Route
            path="/patron"
            element={
              <ProtectedRoute allowedRoles={["patron"]}>
                <PatronDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;