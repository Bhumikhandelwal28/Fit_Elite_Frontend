import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import CloseButton from "../../components/CloseButton";
import { extractErrorMessage } from "../../utils/extractErrorMessage.js";
import "./auth.css";

const ROLE_REDIRECTS = {
  Admin: "/admin/dashboard",
  GymOwner: "/owner/dashboard",
  Member: "/member/dashboard",
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data);
      navigate(ROLE_REDIRECTS[res.data.role] || "/login");
    } catch (err) {
      setError(extractErrorMessage(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="auth-shell">
    <CloseButton />
    <span className="auth-brand">Fit_Elite</span>
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-caption">Log in to your account.</p>

        {error && <div className="banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="field-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="auth-footer-link">
          New here? <a href="/register">Create an account</a>
        </p>
      </div>
    </div>
  );
}