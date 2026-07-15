import React from "react";
import { useNavigate } from "react-router-dom";
import CloseButton from "../../components/CloseButton";
import "./auth.css";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="auth-shell">
      <CloseButton />
      <span className="auth-brand">Fit_Elite</span>
      <h1 className="role-heading">How are you joining Fit_Elite?</h1>
      <p className="role-sub">Pick the account type that matches what you're here to do.</p>

      <div className="role-grid">
        <button className="role-card member" onClick={() => navigate("/register/member")}>
          <span className="role-tag">For members</span>
          <div className="role-title">Join a Gym</div>
          <p className="role-desc">Browse gyms near you, pick a plan, and track your subscription.</p>
        </button>

        <button className="role-card owner" onClick={() => navigate("/register/gym-owner")}>
          <span className="role-tag">For gym owners</span>
          <div className="role-title">List Your Gym</div>
          <p className="role-desc">Register your gym, manage plans, and track members and payments.</p>
        </button>
      </div>

      <p className="auth-footer-link">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
}