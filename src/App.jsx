import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import RoleSelect from "./pages/auth/RoleSelect";
import MemberRegister from "./pages/auth/MemberRegister";
import GymOwnerRegister from "./pages/auth/GymOwnerRegister";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";

import BrowseGyms from "./pages/member/BrowseGyms";
import GymDetails from "./pages/member/GymDetails";
import MySubscriptions from "./pages/member/MySubscriptions";
import PaymentHistory from "./pages/member/PaymentHistory";

import GymProfile from "./pages/gymOwner/GymProfile";
import ManagePlans from "./pages/gymOwner/ManagePlans";
import MemberList from "./pages/gymOwner/MemberList";
import PaymentReports from "./pages/gymOwner/PaymentReports";

import GymApprovalList from "./pages/admin/GymApprovalList";
import UserList from "./pages/admin/UserList";
import GymList from "./pages/admin/GymList";
import AdminGymDetails from "./pages/admin/AdminGymDetails";

import AdminDashboard from "./pages/admin/AdminDashboard";
import OwnerDashboard from "./pages/gymOwner/OwnerDashboard";
import MemberDashboard from "./pages/member/MemberDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RoleSelect />} />
          <Route path="/register/member" element={<MemberRegister />} />
          <Route path="/register/gym-owner" element={<GymOwnerRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected - role based */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/gyms" element={<ProtectedRoute allowedRoles={["Admin"]}><GymList /></ProtectedRoute>} />
          <Route path="/admin/approvals" element={<ProtectedRoute allowedRoles={["Admin"]}><GymApprovalList /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["Admin"]}><UserList /></ProtectedRoute>} />
          <Route path="/admin/gyms/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminGymDetails /></ProtectedRoute>}/>
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["GymOwner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
          path="/owner/gym"
          element={
            <ProtectedRoute allowedRoles={["GymOwner"]}>
              <GymProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/plans"
          element={
            <ProtectedRoute allowedRoles={["GymOwner"]}>
              <ManagePlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/members"
          element={
            <ProtectedRoute allowedRoles={["GymOwner"]}>
              <MemberList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/payments"
          element={
            <ProtectedRoute allowedRoles={["GymOwner"]}>
              <PaymentReports />
            </ProtectedRoute>
          }
        />

          <Route
            path="/member/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Member"]}>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />

          {/* Member - Gyms, Subscriptions, Payments */}
          <Route
            path="/member/gyms"
            element={
              <ProtectedRoute allowedRoles={["Member"]}>
                <BrowseGyms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/gyms/:id"
            element={
              <ProtectedRoute allowedRoles={["Member"]}>
                <GymDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/subscriptions"
            element={
              <ProtectedRoute allowedRoles={["Member"]}>
                <MySubscriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/payments"
            element={
              <ProtectedRoute allowedRoles={["Member"]}>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;