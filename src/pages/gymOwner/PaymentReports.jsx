import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getGymByOwner } from "../../api/gymApi";
import { getPaymentsByGym } from "../../api/paymentApi";
import "../member/member.css";

export default function PaymentReports() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;
    getGymByOwner(user.userId).then((res) => {
      getPaymentsByGym(res.data.id)
        .then((r) => setPayments(r.data))
        .finally(() => setLoading(false));
    });
  }, [user]);

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="member-shell">
      <Navbar />
      <div className="member-content">
        <h1 className="page-heading">Payment Reports</h1>
        <p className="page-sub">Total revenue: <strong>₹{totalRevenue}</strong></p>

        {loading && <p>Loading…</p>}

        {!loading && payments.length === 0 && (
          <div className="empty-state">No payments received yet.</div>
        )}

        {payments.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
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
                  <td>{p.memberName}</td>
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