import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard-shared.css";

function urgencyTier(daysLeft) {
  if (daysLeft === null || daysLeft === undefined) return "healthy";
  if (daysLeft <= 5) return "critical";
  if (daysLeft <= 14) return "soon";
  return "healthy";
}
//component
export default function MemberDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    axiosInstance
      .get("/dashboard/member")
      .then((res) => setData(res.data))
      .catch(() => setError("Couldn't load your dashboard. Try refreshing the page."));
  }, []);

  const tier = data ? urgencyTier(data.daysLeft) : "healthy";
  const progressPct =
    data && data.daysLeft !== null ? Math.min(100, Math.round((data.daysLeft / 30) * 100)) : 100;

  return (
    <div className="dash-shell">
      <Navbar />
      <div className="dash-content">
        <header className="dash-header">
          <p className="dash-eyebrow">Membership</p>
          <h1 className="dash-title">My Dashboard</h1>
        </header>

        {error && <div className="dash-error">{error}</div>}

        {!data && !error && (
          <div className="membership-card">
            <div className="membership-card__main">
              <div className="skeleton skeleton--label" style={{ width: 120, marginBottom: 10 }} />
              <div className="skeleton skeleton--value" style={{ width: 180, marginBottom: 24 }} />
              <div className="skeleton skeleton--label" style={{ width: 240 }} />
            </div>
          </div>
        )}

        {data && data.hasActivePlan && (
          <div className="membership-card">
            <div className="membership-card__main">
              <p className="membership-card__gym">{data.gymName}</p>
              <p className="membership-card__plan">{data.planName}</p>

              <div className="membership-card__row">
                <div className="membership-card__field">
                  <p className="membership-card__field-label">Status</p>
                  <span
                    className={`status-pill ${
                      tier === "healthy" ? "status-pill--active" : "status-pill--expiring"
                    }`}
                  >
                    {data.status}
                  </span>
                </div>
                {data.daysLeft !== null && (
                  <div className="membership-card__field">
                    <p className="membership-card__field-label">Days Left</p>
                    <p
                      className={`membership-card__field-value ${
                        tier === "critical"
                          ? "membership-card__field-value--critical"
                          : tier === "soon"
                          ? "membership-card__field-value--soon"
                          : ""
                      }`}
                    >
                      {data.daysLeft}
                    </p>
                  </div>
                )}
              </div>

              {data.daysLeft !== null && (
                <div className="membership-card__progress">
                  <div className="progress-bar">
                    <div
                      className={`progress-bar__fill progress-bar__fill--${tier}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="progress-caption">
                    {tier === "critical"
                      ? "Renews very soon — top up to avoid a gap in access."
                      : tier === "soon"
                      ? "Coming up for renewal in the next couple of weeks."
                      : `Plenty of time left — renews in ${data.daysLeft} days.`}
                  </p>
                </div>
              )}
            </div>

            <div className="membership-card__aside">
              <div className={`status-ring ${tier !== "healthy" ? `status-ring--${tier}` : ""}`}>
                <span className="status-ring__value">{data.daysLeft ?? "—"}</span>
                <span className="status-ring__label">days</span>
              </div>
              <button className="btn-card" onClick={() => navigate("/member/subscriptions")}>
                {tier === "critical" ? "Renew Now" : "Manage Plan"}
              </button>
            </div>
          </div>
        )}

        {data && !data.hasActivePlan && (
          <div className="empty-state">
            <p>You don't have an active plan yet. Browse gyms to get started!</p>
            <button className="btn-primary" onClick={() => navigate("/member/gyms")}>
              Browse Gyms
            </button>
          </div>
        )}
      </div>
    </div>
  );
}