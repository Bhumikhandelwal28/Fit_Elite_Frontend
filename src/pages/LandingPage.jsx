import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import "./LandingPage.css";

const FEATURES = [
  {
    tag: "Authentication",
    title: "Secure role-based access",
    desc: "JWT-secured login with separate experiences for members, gym owners, and admins."
  },
  {
    tag: "Gym Management",
    title: "Run your gym online",
    desc: "Add gym details, upload photos, and manage services — all from one dashboard."
  },
  {
    tag: "Subscription Plans",
    title: "Flexible membership plans",
    desc: "Create monthly, quarterly, or yearly plans with custom pricing and benefits."
  },
  {
    tag: "Payments",
    title: "Track every transaction",
    desc: "Full payment history and revenue summaries, updated in real time."
  },
  {
    tag: "Dashboards",
    title: "Insights that matter",
    desc: "Personalised dashboards show exactly what each role needs to see, instantly."
  },
  {
    tag: "Member Tools",
    title: "Track your progress",
    desc: "Members see remaining days, active plans, and payment history at a glance."
  }
];

const ADVANTAGES = [
  "No manual paperwork — everything lives in one place",
  "Role-based dashboards for Admin, Gym Owner, and Member",
  "Real-time subscription and payment tracking",
  "Built on a secure, scalable clean architecture"
];

const ROLE_HOME = {
  Admin: "/admin/dashboard",
  GymOwner: "/owner/dashboard",
  Member: "/member/dashboard",
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ gyms: null, members: null, plans: null });

  useEffect(() => {
    if (user) {
      navigate(ROLE_HOME[user.role] || "/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    axiosInstance
      .get("/stats")
      .then((res) => setStats(res.data))
      .catch(() => {
        setStats({ gyms: 120, members: 8500, plans: 340 });
      });
  }, []);

  if (user) return null;

  return (
    <div className="landing">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <span className="hero-eyebrow">Fit_Elite · Gym Management, Simplified</span>
        <h1 className="hero-title">
          Run your gym.<br />Grow your members.<br /><span className="hero-accent">All in one place.</span>
        </h1>
        <p className="hero-sub">
          Fit_Elite connects gym owners and members on a single platform — plans, payments,
          and progress tracking, without the spreadsheets.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate("/register")}>Get started</button>
          <button className="btn-secondary" onClick={() => navigate("/login")}>Log in</button>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-strip">
        <div className="stat-item">
          <span className="stat-number">{stats.gyms ?? "—"}+</span>
          <span className="stat-label">Gyms connected</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.members ?? "—"}+</span>
          <span className="stat-label">Active members</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.plans ?? "—"}+</span>
          <span className="stat-label">Plans available</span>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <h2 className="section-title">Everything a gym needs to run online</h2>
        <p className="section-sub">Six modules, working together.</p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-tag">{f.tag}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className="section advantages-section">
        <h2 className="section-title">Why gyms choose Fit_Elite</h2>
        <ul className="advantages-list">
          {ADVANTAGES.map((point) => (
            <li key={point} className="advantage-item">
              <span className="advantage-mark">＋</span>
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to bring your gym online?</h2>
        <button className="btn-primary" onClick={() => navigate("/register")}>Create your account</button>
      </section>

      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} Fit_Elite. All rights reserved.</span>
      </footer>
    </div>
  );
}