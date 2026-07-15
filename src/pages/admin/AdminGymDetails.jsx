import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getAdminGymDetail } from "../../api/gymApi";
import { getPlansByGym } from "../../api/planApi";
import { getPaymentsByGym } from "../../api/paymentApi";
import { getSubscriptionsByGym } from "../../api/subscriptionApi";
import "../gymOwner/owner.css";
import "./admin.css";

const TABS = ["Overview", "Plans", "Members", "Payments"];

export default function AdminGymDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Overview");
  const [gym, setGym] = useState(null);
  const [gymLoading, setGymLoading] = useState(true);

  const [plans, setPlans] = useState(null); // null = abhi tak load nahi hua
  const [plansLoading, setPlansLoading] = useState(false);

  const [members, setMembers] = useState(null);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState("");

  const [payments, setPayments] = useState(null);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  // Overview - gym ki basic + owner info, hamesha load hoti hai (page ka core)
  useEffect(() => {
    getAdminGymDetail(id)
      .then((res) => setGym(res.data))
      .finally(() => setGymLoading(false));
  }, [id]);

  // Plans - sirf jab tab click ho, aur sirf ek baar
  useEffect(() => {
    if (activeTab === "Plans" && plans === null) {
      setPlansLoading(true);
      getPlansByGym(id).then((res) => setPlans(res.data)).finally(() => setPlansLoading(false));
    }
  }, [activeTab, id, plans]);

  // Members - sirf jab tab click ho, aur sirf ek baar
  useEffect(() => {
    if (activeTab === "Members" && members === null && !membersError) {
      setMembersLoading(true);
      getSubscriptionsByGym(id)
        .then((res) => setMembers(res.data))
        .catch(() => setMembersError("Couldn't load members for this gym."))
        .finally(() => setMembersLoading(false));
    }
  }, [activeTab, id, members, membersError]);

  // Payments - sirf jab tab click ho, aur sirf ek baar
  useEffect(() => {
    if (activeTab === "Payments" && payments === null) {
      setPaymentsLoading(true);
      getPaymentsByGym(id).then((res) => setPayments(res.data)).finally(() => setPaymentsLoading(false));
    }
  }, [activeTab, id, payments]);

  if (gymLoading) return <div className="admin-shell"><Navbar /><div className="admin-content"><p>Loading…</p></div></div>;
  if (!gym) return <div className="admin-shell"><Navbar /><div className="admin-content"><p>Gym not found.</p></div></div>;

  const totalRevenue = (payments || [])
    .filter((p) => p.paymentStatus === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const activeMemberCount = (members || []).filter((m) => m.status === "Active").length;

  return (
    <div className="admin-shell">
      <Navbar />
      <div className="admin-content">
        <span className="back-link" onClick={() => navigate(-1)}>← Back</span>

        <div className="owner-header-row">
          <div>
            <h1 className="page-heading" style={{ marginBottom: 4 }}>{gym.gymName}</h1>
            <span className={`status-badge status-${gym.isApproved ? "Active" : "Pending"}`}>
              {gym.isApproved ? "Approved" : "Pending Approval"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--line)", marginBottom: 24 }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 18px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid var(--ink)" : "2px solid transparent",
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? "var(--ink)" : "var(--muted)",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontSize: 15,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "Overview" && (
          <div>
            <h2>Gym Details</h2>
            <p>{gym.addressLine1}{gym.addressLine2 ? `, ${gym.addressLine2}` : ""}, {gym.city}, {gym.state}, {gym.country} — {gym.postalCode}</p>
            <p>Contact: {gym.contactNumber}{gym.email ? ` · ${gym.email}` : ""}</p>
            <p>Hours: {gym.openingTime} – {gym.closingTime}</p>

            <h2 style={{ marginTop: 28 }}>Owner</h2>
            <p><strong>{gym.ownerName}</strong></p>
            <p>{gym.ownerEmail}</p>
            {gym.ownerPhone && <p>{gym.ownerPhone}</p>}
          </div>
        )}

        {/* Plans tab */}
        {activeTab === "Plans" && (
          <div>
            {plansLoading && <p>Loading plans…</p>}
            {!plansLoading && plans && plans.length === 0 && (
              <div className="empty-state">No plans added yet.</div>
            )}
            {!plansLoading && plans && plans.length > 0 && (
              <div className="plan-grid">
                {plans.map((plan) => (
                  <div className="plan-card" key={plan.id}>
                    <div className="plan-name">{plan.planName}</div>
                    <div className="plan-price">₹{plan.price}</div>
                    <div className="plan-duration">{plan.durationInDays} days</div>
                    <div className="plan-benefits">{plan.benefits}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Members tab */}
        {activeTab === "Members" && (
          <div>
            {membersLoading && <p>Loading members…</p>}
            {membersError && <div className="banner">{membersError}</div>}
            {!membersLoading && !membersError && members && (
              <>
                <p className="page-sub">
                  {members.length} member{members.length === 1 ? "" : "s"} total ·{" "}
                  <strong>{activeMemberCount} active</strong>
                </p>
                {members.length === 0 ? (
                  <div className="empty-state">No members have subscribed to this gym yet.</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Plan</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.memberSubscriptionId ?? m.id}>
                          <td>{m.memberName}</td>
                          <td>{m.planName}</td>
                          <td>
                            <span className={`status-badge status-${m.status}`}>{m.status}</span>
                          </td>
                          <td>{m.startDate ? new Date(m.startDate).toLocaleDateString() : "—"}</td>
                          <td>{m.endDate ? new Date(m.endDate).toLocaleDateString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        )}

        {/* Payments tab */}
        {activeTab === "Payments" && (
          <div>
            {paymentsLoading && <p>Loading payments…</p>}
            {!paymentsLoading && payments && (
              <>
                <p className="page-sub">Total revenue: <strong>₹{totalRevenue}</strong></p>
                {payments.length === 0 ? (
                  <div className="empty-state">No payments recorded for this gym.</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Plan</th>
                        <th>Amount</th>
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
                          <td><span className={`status-badge status-${p.paymentStatus}`}>{p.paymentStatus}</span></td>
                          <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}