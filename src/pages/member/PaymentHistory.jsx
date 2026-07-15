import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getPaymentsByMember } from "../../api/paymentApi";
import { useAuth } from "../../context/AuthContext";
import "./member.css";

export default function PaymentHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;
    getPaymentsByMember(user.userId)
      .then((res) => setPayments(res.data))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="member-shell">
      <Navbar />
      <div className="member-content">
        <h1 className="page-heading">Payment History</h1>
        <p className="page-sub">Every transaction you've made on Fit_Elite.</p>

        {loading && <p>Loading…</p>}

        {!loading && payments.length === 0 && (
          <div className="empty-state">No payments yet.</div>
        )}

        {payments.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Gym</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.gymName}</td>
                  <td>{p.planName}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.paymentMethod}</td>
                  <td><span className={`status-badge status-${p.paymentStatus}`}>{p.paymentStatus}</span></td>
                  <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}