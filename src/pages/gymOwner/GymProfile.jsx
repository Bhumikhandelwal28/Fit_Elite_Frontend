import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getGymByOwner, updateGym } from "../../api/gymApi";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import "../auth/auth.css";
import "./owner.css";

function VerifiedBadge({ approved }) {
  if (approved) {
    return (
      <span className="verify-badge verify-badge--verified">
        <svg className="verify-badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Verified
      </span>
    );
  }
  return (
    <span className="verify-badge verify-badge--pending">
      <svg className="verify-badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Pending review
    </span>
  );
}

const SUMMARY_FIELDS = [
  { key: "gymName", label: "Gym name" },
  { key: "addressLine1", label: "Address line 1" },
  { key: "addressLine2", label: "Address line 2" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "postalCode", label: "Postal code" },
  { key: "contactNumber", label: "Contact number" },
  { key: "email", label: "Email" },
  { key: "openingTime", label: "Opening time", format: (v) => v?.slice(0, 5) },
  { key: "closingTime", label: "Closing time", format: (v) => v?.slice(0, 5) },
];

export default function GymProfile() {
  const { user } = useAuth();
  const [gym, setGym] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.userId) return;
    getGymByOwner(user.userId)
      .then((res) => {
        setGym(res.data);
        setForm(res.data);
      })
      .catch(() => setError("Could not load your gym profile."))
      .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEditing = () => {
    setForm(gym);
    setMessage("");
    setError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setForm(gym);
    setError("");
    setEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await updateGym(gym.id, form);
      setGym(form);
      setMessage("Gym profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(extractErrorMessage(err, "Could not update gym."));
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="owner-shell">
        <Navbar />
        <div className="owner-content">
          <p>Loading...</p>
        </div>
      </div>
    );

  if (!gym)
    return (
      <div className="owner-shell">
        <Navbar />
        <div className="owner-content">
          <p>{error || "Gym not found."}</p>
        </div>
      </div>
    );

  return (
    <div className="owner-shell">
      <Navbar />
      <div className="owner-content">
        <div className="owner-header-row">
          <div className="gym-title-group">
            <h1 className="page-heading">Gym Profile</h1>
            <VerifiedBadge approved={gym.isApproved} />
          </div>
          {!editing && (
            <button className="btn-small outline" onClick={startEditing}>
              Edit profile
            </button>
          )}
        </div>

        {message && (
          <div className="banner" style={{ background: "#E5F6EA", borderColor: "#1B7A3D", color: "#1B7A3D" }}>
            {message}
          </div>
        )}
        {error && <div className="banner">{error}</div>}

        {!editing ? (
          <div className="profile-summary">
            <div className="profile-summary__header">Profile details</div>
            <div className="profile-summary__grid">
              {SUMMARY_FIELDS.map(({ key, label, format }) => {
                const raw = gym[key];
                const value = format ? format(raw) : raw;
                return (
                  <div className="summary-field" key={key}>
                    <p className="summary-label">{label}</p>
                    <p className="summary-value">{value || "—"}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ maxWidth: 560 }}>
            <div className="field-group">
              <label>Gym name</label>
              <input name="gymName" value={form.gymName} onChange={handleChange} required />
            </div>
            <div className="field-group">
              <label>Address line 1</label>
              <input name="addressLine1" value={form.addressLine1} onChange={handleChange} required />
            </div>
            <div className="field-group">
              <label>Address line 2</label>
              <input name="addressLine2" value={form.addressLine2 || ""} onChange={handleChange} />
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>City</label>
                <input name="city" value={form.city} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>State</label>
                <input name="state" value={form.state} onChange={handleChange} required />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>Country</label>
                <input name="country" value={form.country} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Postal code</label>
                <input name="postalCode" value={form.postalCode} onChange={handleChange} required />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>Contact number</label>
                <input name="contactNumber" value={form.contactNumber} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email || ""} onChange={handleChange} />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label>Opening time</label>
                <input
                  type="time"
                  name="openingTime"
                  value={form.openingTime?.slice(0, 5) || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field-group">
                <label>Closing time</label>
                <input
                  type="time"
                  name="closingTime"
                  value={form.closingTime?.slice(0, 5) || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" type="submit" disabled={saving} style={{ marginTop: 0 }}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button type="button" className="btn-secondary" onClick={cancelEditing} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}