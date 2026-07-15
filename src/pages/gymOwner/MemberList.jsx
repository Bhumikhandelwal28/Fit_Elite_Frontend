import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getGymByOwner } from "../../api/gymApi";
import { getSubscriptionsByGym } from "../../api/subscriptionApi";
import "../member/member.css";
import "../gymOwner/owner.css"

export default function MemberList() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!user?.userId) return;
    getGymByOwner(user.userId).then((res) => {
      getSubscriptionsByGym(res.data.id)
        .then((r) => setMembers(r.data))
        .finally(() => setLoading(false));
    });
  }, [user]);

  const filtered = filter === "All" ? members : members.filter((m) => m.status === filter);

  return (
    <div className="member-shell">
      <Navbar />
      <div className="member-content">
        <h1 className="page-heading">Members</h1>
        <p className="page-sub">Everyone who has ever subscribed to your gym.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["All", "Active", "Pending", "Expired", "Cancelled"].map((f) => (
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

        {!loading && filtered.length === 0 && (
          <div className="empty-state">No members found for this filter.</div>
        )}

        {filtered.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td>{m.memberName}</td>
                  <td>{m.planName}</td>
                  <td>{new Date(m.startDate).toLocaleDateString()}</td>
                  <td>{new Date(m.endDate).toLocaleDateString()}</td>
                  <td><span className={`status-badge status-${m.status}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}