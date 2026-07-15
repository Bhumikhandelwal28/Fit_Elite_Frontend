import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getMySubscriptions, cancelSubscription } from "../../api/subscriptionApi";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import "./member.css";

export default function MySubscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");

  const loadSubs = () => {
    setLoading(true);
    getMySubscriptions()
      .then((res) => setSubs(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubs();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;

    setError("");
    setCancellingId(id);
    try {
      await cancelSubscription(id);
      loadSubs(); 
    } catch (err) {
      setError(extractErrorMessage(err, "Could not cancel subscription."));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="member-shell">
      <Navbar />
      <div className="member-content">
        <h1 className="page-heading">My Subscriptions</h1>
        <p className="page-sub">All your gym memberships, past and present.</p>

        {error && <div className="banner">{error}</div>}
        {loading && <p>Loading…</p>}

        {!loading && subs.length === 0 && (
          <div className="empty-state">You haven't subscribed to any plan yet.</div>
        )}

        {subs.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Gym</th>
                <th>Plan</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td>{s.gymName}</td>
                  <td>{s.planName}</td>
                  <td>{new Date(s.startDate).toLocaleDateString()}</td>
                  <td>{new Date(s.endDate).toLocaleDateString()}</td>
                  <td><span className={`status-badge status-${s.status}`}>{s.status}</span></td>
                  <td>
                    {(s.status === "Active" || s.status === "Pending") && (
                      <button
                        className="cancel-link"
                        disabled={cancellingId === s.id}
                        onClick={() => handleCancel(s.id)}
                      >
                        {cancellingId === s.id ? "Cancelling…" : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}