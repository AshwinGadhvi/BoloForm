import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import OtpLogin from "../pages/auth/OtpLogin";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Dashboard from "../pages/user/Dashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import PdfEditor from "../pages/pdf/PdfEditor";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-login" element={<OtpLogin />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* PDF Editor (Protected) */}
        <Route
          path="/pdf-editor"
          element={
            <ProtectedRoute>
              <PdfEditor />
            </ProtectedRoute>
          }
        />
        <Route
  path="/pdf-editor/:id"
  element={
    <ProtectedRoute>
      <PdfEditor />
    </ProtectedRoute>
  }
/>

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
