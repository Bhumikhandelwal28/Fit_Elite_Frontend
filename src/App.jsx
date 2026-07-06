import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RoleSelect from "./pages/auth/RoleSelect";
import MemberRegister from "./pages/auth/MemberRegister";
import GymOwnerRegister from "./pages/auth/GymOwnerRegister";
import Login from "./pages/auth/Login";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RoleSelect />} />
          <Route path="/register/member" element={<MemberRegister />} />
          <Route path="/register/gym-owner" element={<GymOwnerRegister />} />
          <Route path="/login" element={<Login />} />
          {/* dashboards yaha add karenge next */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;