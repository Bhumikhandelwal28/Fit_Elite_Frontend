// src/pages/gymOwner/OwnerDashboard.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/dashboard-shared.css";

/* ---------- Inline icon set (no extra dependency) ---------- */
const Icon = {
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 14.2c2.5.3 4.5 2.6 4.5 5.8" strokeLinecap="round" />
    </svg>
  ),
  Rupee: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 4h12M6 4c0 4.5 3 6 6 6s6-1.5 6 0M6 10h12M6 10l8 10M6 14h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

function StatCard({ icon, label, value, hint, tone = "neutral" }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-card__top">
        <span className="stat-card__icon">{icon}</span>
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

function urgencyBadge(daysLeft) {
  if (daysLeft <= 2) {
    return <span className="urgency-badge urgency-badge--critical">{daysLeft} day{daysLeft === 1 ? "" : "s"} left</span>;
  }
  return <span className="urgency-badge urgency-badge--soon">{daysLeft} days left</span>;
}

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/dashboard/owner")
      .then((res) => setData(res.data))
      .catch(() => setError("Couldn't load your dashboard. Try refreshing the page."));
  }, []);

  return (
    <div className="dash-shell">
      <Navbar />
      <div className="dash-content">
        <header className="dash-header">
          <p className="dash-eyebrow">Owner overview</p>
          <h1 className="dash-title">{data ? data.gymName : "Your Gym"}</h1>
          <p className="dash-subtitle">A snapshot of your gym's members and earnings.</p>
        </header>

        {error && <div className="dash-error">{error}</div>}

        <section className="stat-grid" aria-busy={!data && !error}>
          {!data && !error ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : data ? (
            <>
              <StatCard
                icon={<Icon.Users />}
                label="Active Members"
                value={data.totalActiveMembers}
                hint="Currently on a live plan"
              />
              <StatCard
                icon={<Icon.Rupee />}
                label="Total Earnings"
                value={`₹${Number(data.totalEarnings).toLocaleString("en-IN")}`}
                hint="Lifetime earnings from this gym"
                tone="positive"
              />
            </>
          ) : null}
        </section>

        {data && (
          <>
            <h3 className="dash-section-title">Expiring Soon</h3>
            {data.expiringPlans.length === 0 ? (
              <div className="empty-state">
                <p>No plans expiring in the next 7 days.</p>
              </div>
            ) : (
              <div className="list-card">
                {data.expiringPlans.map((p) => (
                  <div className="list-row" key={p.memberSubscriptionId}>
                    <div>
                      <div className="list-row__name">{p.memberName}</div>
                      <div className="list-row__meta">{p.planName}</div>
                    </div>
                    {urgencyBadge(p.daysLeft)}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}