import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerMember } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import CloseButton from "../../components/CloseButton";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import "./auth.css";

export default function MemberRegister() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phoneNumber: "" });
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
      const res = await registerMember(form);
      loginUser(res.data);
      navigate("/member/dashboard");
    } catch (err) {
      setError(extractErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <CloseButton />
      <span className="auth-brand">Fit_Elite</span>
      <div className="auth-card">
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-caption">Start browsing gyms and plans near you.</p>

        {error && <div className="banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Full name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="field-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="field-group">
            <label>Phone number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-footer-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}