import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
import ProfileIcon from "./ProfileIcon";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const roleHome = {
    Admin: "/admin/dashboard",
    GymOwner: "/owner/dashboard",
    Member: "/member/dashboard",
  };

  return (
    <nav className="navbar">
      <div
        className="navbar-brand"
        onClick={() => navigate(user ? roleHome[user.role] || "/" : "/")}
      >
        Fit_Elite
      </div>

      <div className="navbar-actions">
        {!user && (
          <>
            <button className="nav-btn ghost" onClick={() => navigate("/login")}>Log in</button>
            <button className="nav-btn solid" onClick={() => navigate("/register")}>Register</button>
          </>
        )}

        {user?.role === "Member" && (
          <>
            <button className="nav-btn ghost" onClick={() => navigate("/member/gyms")}>Browse Gyms</button>
            <button className="nav-btn ghost" onClick={() => navigate("/member/subscriptions")}>My Subscriptions</button>
            <button className="nav-btn ghost" onClick={() => navigate("/member/payments")}>Payment History</button>
            <ProfileIcon />
            
          </>
        )}

        {user?.role === "GymOwner" && (
          <>
            <button className="nav-btn ghost" onClick={() => navigate("/owner/gym")}>Gym Profile</button>
            <button className="nav-btn ghost" onClick={() => navigate("/owner/plans")}>Plans</button>
            <button className="nav-btn ghost" onClick={() => navigate("/owner/members")}>Members</button>
            <button className="nav-btn ghost" onClick={() => navigate("/owner/payments")}>Payments</button>
            <ProfileIcon />
            
          </>
        )}

        {user?.role === "Admin" && (
        <>
          <button className="nav-btn ghost" onClick={() => navigate("/admin/gyms")}>All Gyms</button>
          <button className="nav-btn ghost" onClick={() => navigate("/admin/approvals")}>Approvals</button>
          <button className="nav-btn ghost" onClick={() => navigate("/admin/users?role=GymOwner")}>Gym Owners</button>
          <button className="nav-btn ghost" onClick={() => navigate("/admin/users?role=Member")}>Members</button>
          <ProfileIcon />
        </>
      )}
      </div>
    </nav>
  );
}