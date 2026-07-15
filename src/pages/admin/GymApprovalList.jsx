import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllGyms, approveGym } from "../../api/gymApi";
import "../gymOwner/owner.css";
import "./admin.css";

export default function GymApprovalList() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [filter, setFilter] = useState("Pending");

  const loadGyms = () => {
    setLoading(true);
    getAllGyms().then((res) => setGyms(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadGyms(); }, []);

  const handleApprove = async (gymId) => {
    setApprovingId(gymId);
    try {
      await approveGym(gymId);
      loadGyms();
    } finally {
      setApprovingId(null);
    }
  };

  const filtered = gyms.filter((g) =>
    filter === "All" ? true : filter === "Pending" ? !g.isApproved : g.isApproved
  );

  return (
    <div className="admin-shell">
      <Navbar />
      <div className="admin-content">
        <h1 className="page-heading">Gym Approvals</h1>
        <p className="page-sub">Review and approve gyms registered on the platform.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["Pending", "Approved", "All"].map((f) => (
            <button
              key={f}
              className="btn-small outline"
              style={{ background: filter === f ? "var(--ink)" : "transparent", color: filter === f ? "#fff" : "var(--graphite)" }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && <p>Loading…</p>}
        {!loading && filtered.length === 0 && <div className="empty-state">No gyms found.</div>}

        {filtered.map((gym) => (
          <div className="plan-manage-card" key={gym.id}>
            <div>
              <div className="plan-name">{gym.gymName}</div>
              <div className="plan-duration">{gym.city}, {gym.state}</div>
              <span className={`status-badge status-${gym.isApproved ? "Active" : "Pending"}`} style={{ marginTop: 8, display: "inline-block" }}>
                {gym.isApproved ? "Approved" : "Pending Approval"}
              </span>
            </div>
            {!gym.isApproved && (
              <button className="btn-small" disabled={approvingId === gym.id} onClick={() => handleApprove(gym.id)}>
                {approvingId === gym.id ? "Approving…" : "Approve"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}