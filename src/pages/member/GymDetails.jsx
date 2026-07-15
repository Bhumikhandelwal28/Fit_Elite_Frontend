import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getGymById } from "../../api/gymApi";
import { getPlansByGym } from "../../api/planApi";
import { subscribeToPlan } from "../../api/paymentApi";
import { getMySubscriptions } from "../../api/subscriptionApi";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import "../auth/auth.css";
import "./member.css";

export default function GymDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [plans, setPlans] = useState([]);
  const [mySubs, setMySubs] = useState([]); // is gym ke plans ke against member ke existing subscriptions
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = () => {
    setLoading(true);
    Promise.all([getGymById(id), getPlansByGym(id), getMySubscriptions()])
      .then(([gymRes, plansRes, subsRes]) => {
        setGym(gymRes.data);
        setPlans(plansRes.data);
        setMySubs(subsRes.data);
      })
      .catch(() => setError("Could not load gym details."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
   
  }, [id]);

  
  const getSubStatusForPlan = (planId) => {
    const sub = mySubs.find(
      (s) =>
        s.subscriptionPlanId === planId &&
        (s.status === "Active" || s.status === "Pending")
    );
    return sub ? sub.status : null;
  };


  const hasSubscriptionAtThisGym = mySubs.some(
    (s) =>
      s.gymId === Number(id) &&
      (s.status === "Active" || s.status === "Pending")
  );

  const hasSubscriptionAtOtherGym = mySubs.some(
    (s) =>
      s.gymId !== Number(id) &&
      (s.status === "Active" || s.status === "Pending")
  );

  const handleSubscribe = async (planId) => {
    setError("");
    setMessage("");
    setSubscribingId(planId);
    try {
      const res = await subscribeToPlan({
        subscriptionPlanId: planId,
        paymentMethod: "Card",
      });
      setMessage(res.data.message || "Subscribed successfully!");
      loadData(); // fresh data - button state turant update ho jayega
    } catch (err) {
      setError(extractErrorMessage(err, "Could not subscribe. Please try again."));
    } finally {
      setSubscribingId(null);
    }
  };

  if (loading) return (
    <div className="member-shell"><Navbar /><div className="member-content"><p>Loading…</p></div></div>
  );

  if (!gym) return (
    <div className="member-shell"><Navbar /><div className="member-content"><p>Gym not found.</p></div></div>
  );

  return (
    <div className="member-shell">
      <Navbar />
      <div className="member-content">
        <span className="back-link" onClick={() => navigate("/member/gyms")}>← Back to gyms</span>

        <div className="gym-detail-header">
          <h1 className="gym-detail-name">{gym.gymName}</h1>
          <p className="gym-detail-meta">
            {gym.addressLine1}{gym.addressLine2 ? `, ${gym.addressLine2}` : ""}, {gym.city}, {gym.state}, {gym.country} — {gym.postalCode}
          </p>
          <p className="gym-detail-meta">Contact: {gym.contactNumber}{gym.email ? ` · ${gym.email}` : ""}</p>
          <p className="gym-detail-meta">Hours: {gym.openingTime} – {gym.closingTime}</p>
        </div>

        {message && <div className="banner" style={{ background: "#E5F6EA", borderColor: "#1B7A3D", color: "#1B7A3D" }}>{message}</div>}
        {error && <div className="banner">{error}</div>}

        {hasSubscriptionAtOtherGym && !hasSubscriptionAtThisGym && (
          <div className="banner">
            You already have an active membership at another gym. You can't subscribe here until that ends.
          </div>
        )}

        <h2 style={{ marginBottom: 16 }}>Available Plans</h2>

        {plans.length === 0 && <div className="empty-state">This gym hasn't added any plans yet.</div>}

        <div className="plan-grid">
          {plans.map((plan) => {
            const subStatus = getSubStatusForPlan(plan.id);
            const blockedByOtherGym = hasSubscriptionAtOtherGym && !hasSubscriptionAtThisGym;

            return (
              <div className="plan-card" key={plan.id}>
                <div className="plan-name">{plan.planName}</div>
                <div className="plan-price">₹{plan.price}</div>
                <div className="plan-duration">{plan.durationInDays} days</div>
                <div className="plan-benefits">{plan.benefits}</div>

                {subStatus ? (
                  <span className={`status-badge status-${subStatus}`} style={{ textAlign: "center" }}>
                    {subStatus === "Active" ? "Currently subscribed" : "Queued (will activate later)"}
                  </span>
                ) : (
                  <button
                    className="btn-primary"
                    disabled={subscribingId === plan.id || blockedByOtherGym}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {subscribingId === plan.id ? "Processing…" : "Subscribe"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}