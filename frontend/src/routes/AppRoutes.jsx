import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/auth/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import AdminManage from "../pages/dashboard/AdminManage";
import CaregiverDashboard from "../pages/dashboard/CaregiverDashboard";
import CaregiverPatients from "../pages/dashboard/CaregiverPatients";
import Medicines from "../pages/medicines/Medicines";
import Reminders from "../pages/reminders/Reminders";
import Prescriptions from "../pages/prescriptions/Prescriptions";
import Analytics from "../pages/analytics/Analytics";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";
import MedicationHistory from "../pages/medication-history/MedicationHistory";
import ProtectedRoute from "../components/ProtectedRoute";

function RoleDashboardRouter() {
  const role = (localStorage.getItem("role") || "PATIENT").toUpperCase();

  if (role === "ADMIN") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (role === "CAREGIVER") {
    return <Navigate to="/caregiver-dashboard" replace />;
  }

  return <Dashboard />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleDashboardRouter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/caregiver-dashboard"
          element={
            <ProtectedRoute>
              <CaregiverDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medicines"
          element={
            <ProtectedRoute>
              <Medicines />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/caregiver-patients"
          element={
            <ProtectedRoute>
              <CaregiverPatients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-manage"
          element={
            <ProtectedRoute>
              <AdminManage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute>
              <Prescriptions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medication-history"
          element={
            <ProtectedRoute>
              <MedicationHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}