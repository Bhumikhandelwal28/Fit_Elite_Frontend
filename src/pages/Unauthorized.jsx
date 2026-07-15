import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const roleHome = {
    Admin: "/admin/dashboard",
    GymOwner: "/owner/dashboard",
    Member: "/member/dashboard",
  };

  return (
    <div style={{ padding: 48, textAlign: "center" }}>
      <h2>Access denied</h2>
      <p>You don't have permission to view this page.</p>
      <button onClick={() => navigate(user ? roleHome[user.role] || "/" : "/")}>
        Go back
      </button>
    </div>
  );
}