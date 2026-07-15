import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getGymByOwner } from "../../api/gymApi";
import { getPlansByGym, createPlan, updatePlan, deletePlan, togglePlanVisibility } from "../../api/planApi";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import "../auth/auth.css";
import "./owner.css";

const emptyForm = { planName: "", price: "", durationInDays: "", benefits: "" };

export default function ManagePlans() {
  const { user } = useAuth();
  const [gymId, setGymId] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadPlans = (gId) => {
    getPlansByGym(gId, true) // includeInactive = true, owner should see hidden ones too
      .then((res) => setPlans(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user?.userId) return;
    getGymByOwner(user.userId).then((res) => {
      setGymId(res.data.id);
      loadPlans(res.data.id);
    });
  }, [user]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setEditingId(plan.id);
    setForm({
      planName: plan.planName,
      price: plan.price,
      durationInDays: plan.durationInDays,
      benefits: plan.benefits || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        planName: form.planName,
        price: Number(form.price),
        durationInDays: Number(form.durationInDays),
        benefits: form.benefits,
      };
      if (editingId) {
        await updatePlan(editingId, payload);
      } else {
        await createPlan(gymId, payload);
      }
      setShowModal(false);
      loadPlans(gymId);
    } catch (err) {
      setError(extractErrorMessage(err, "Could not save plan."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm("Remove this plan? Existing members won't be affected.")) return;
    try {
      await deletePlan(planId);
      loadPlans(gymId);
    } catch (err) {
      setError(extractErrorMessage(err, "Could not delete plan."));
    }
  };

  const handleToggle = async (planId) => {
    try {
      await togglePlanVisibility(planId);
      loadPlans(gymId);
    } catch (err) {
      setError(extractErrorMessage(err, "Could not update plan visibility."));
    }
  };

  if (loading) return <div className="owner-shell"><Navbar /><div className="owner-content"><p>Loading…</p></div></div>;

  return (
    <div className="owner-shell">
      <Navbar />
      <div className="owner-content">
        <div className="owner-header-row">
          <div>
            <h1 className="page-heading">Subscription Plans</h1>
            <p className="page-sub">Manage what members can subscribe to.</p>
          </div>
          <button className="btn-small" onClick={openAddModal}>+ Add Plan</button>
        </div>

        {error && <div className="banner">{error}</div>}

        {plans.length === 0 && <div className="empty-state">No plans yet. Add your first plan.</div>}

        {plans.map((plan) => (
          <div className={`plan-manage-card ${!plan.isActive ? "inactive" : ""}`} key={plan.id}>
            <div>
              <div className="plan-name">{plan.planName} {!plan.isActive && "(Hidden)"}</div>
              <div className="plan-price">₹{plan.price} · {plan.durationInDays} days</div>
              <div className="plan-benefits" style={{ marginBottom: 0 }}>{plan.benefits}</div>
            </div>
            <div className="plan-manage-actions">
              <button className="btn-small outline" onClick={() => openEditModal(plan)}>Edit</button>
              <button className="btn-small outline" onClick={() => handleToggle(plan.id)}>
                {plan.isActive ? "Hide" : "Show"}
              </button>
              <button className="btn-small danger" onClick={() => handleDelete(plan.id)}>Delete</button>
            </div>
          </div>
        ))}

        {showModal && (
          <div className="modal-backdrop" onClick={() => setShowModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h2 className="auth-title">{editingId ? "Edit Plan" : "Add Plan"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="field-group">
                  <label>Plan name</label>
                  <input name="planName" value={form.planName} onChange={handleChange} required />
                </div>
                <div className="field-row">
                  <div className="field-group">
                    <label>Price (₹)</label>
                    <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
                  </div>
                  <div className="field-group">
                    <label>Duration (days)</label>
                    <input type="number" name="durationInDays" value={form.durationInDays} onChange={handleChange} required min="1" />
                  </div>
                </div>
                <div className="field-group">
                  <label>Benefits</label>
                  <textarea
                    name="benefits"
                    value={form.benefits}
                    onChange={handleChange}
                    rows={4}
                    style={{ width: "100%", padding: 11, border: "1px solid var(--line)", borderRadius: 3, fontFamily: "var(--font-body)" }}
                  />
                </div>
                <button className="btn-primary" type="submit" disabled={saving}>
                  {saving ? "Saving…" : editingId ? "Update Plan" : "Create Plan"}
                </button>
                <button type="button" className="btn-secondary" style={{ marginTop: 10 }} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}