import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/dashboard-shared.css";


const Icon = {
  Gyms: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 8v8M2 9v6M20 8v8M22 9v6M7 12h10M7 8v8M17 8v8" strokeLinecap="round" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Rupee: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 4h12M6 4c0 4.5 3 6 6 6s6-1.5 6 0M6 10h12M6 10l8 10M6 14h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 14.2c2.5.3 4.5 2.6 4.5 5.8" strokeLinecap="round" />
    </svg>
  ),
  Owner: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeLinecap="round" />
      <path d="M9 4.2l1.4 1.4M15 4.2l-1.4 1.4" strokeLinecap="round" />
    </svg>
  ),
};


function StatCard({ icon, label, value, hint, tone = "neutral" }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-card__top">
        <span className="stat-card__icon">{icon}</span>
        {tone === "attention" && <span className="stat-card__badge">Needs review</span>}
      </div>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__label">{label}</p>
      {hint && <p className="stat-card__hint">{hint}</p>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="stat-card stat-card--skeleton">
      <div className="skeleton skeleton--icon" />
      <div className="skeleton skeleton--value" />
      <div className="skeleton skeleton--label" />
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/dashboard/admin")
      .then((res) => setData(res.data))
      .catch(() => setError("Couldn't load dashboard data. Try refreshing the page."));
  }, []);

  const approvalRate =
    data && data.totalGyms > 0
      ? Math.round((data.approvedGyms / data.totalGyms) * 100)
      : null;

  return (
    <div className="dash-shell">
      <Navbar />
      <div className="dash-content">
        <header className="dash-header">
          <p className="dash-eyebrow">Platform overview</p>
          <h1 className="dash-title">Admin Dashboard</h1>
        </header>

        {error && <div className="dash-error">{error}</div>}

        <section className="stat-grid" aria-busy={!data && !error}>
          {!data && !error ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : data ? (
            <>
              <StatCard
                icon={<Icon.Gyms />}
                label="Total Gyms"
                value={data.totalGyms}
                hint="Registered on the platform"
              />
              <StatCard
                icon={<Icon.Check />}
                label="Approved Gyms"
                value={data.approvedGyms}
                hint={approvalRate !== null ? `${approvalRate}% approval rate` : null}
                tone="positive"
              />
              <StatCard
                icon={<Icon.Clock />}
                label="Pending Approvals"
                value={data.pendingApprovals}
                hint={data.pendingApprovals > 0 ? "Awaiting your decision" : "All caught up"}
                tone={data.pendingApprovals > 0 ? "attention" : "neutral"}
              />
              <StatCard
                icon={<Icon.Rupee />}
                label="Total Platform Revenue"
                value={`₹${Number(data.totalPlatformRevenue).toLocaleString("en-IN")}`}
                hint="Across all active gyms"
              />
              <StatCard
                icon={<Icon.Users />}
                label="Total Members"
                value={data.totalMembers}
                hint="Signed up across all gyms"
              />
              <StatCard
                icon={<Icon.Owner />}
                label="Total Gym Owners"
                value={data.totalGymOwners}
                hint="Managing at least one gym"
              />
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}