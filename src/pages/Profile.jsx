import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyProfile, updateMyProfile, changePassword } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../utils/extractErrorMessage";
import "./auth/auth.css";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = () => {
    setForm(profile);
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(profile);
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const res = await updateMyProfile(form);
      setProfile(res.data);
      setForm(res.data);
      setIsEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(extractErrorMessage(err, "Could not update profile."));
    } finally {
      setSaving(false);
    }
  };

  const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwMessage("");
    setPwSaving(true);
    try {
      await changePassword(pwForm);
      setPwMessage("Password changed successfully.");
      setPwForm({ oldPassword: "", newPassword: "" });
      setTimeout(() => setShowPasswordForm(false), 1500);
    } catch (err) {
      setPwError(extractErrorMessage(err, "Could not change password."));
    } finally {
      setPwSaving(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (loading) return <div className="profile-page"><Navbar /><div className="profile-container"><p>Loading…</p></div></div>;
  if (!profile) return <div className="profile-page"><Navbar /><div className="profile-container"><p>{error || "Profile not found."}</p></div></div>;

  const initial = profile.fullName?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">

        {/* Header */}
        <div className="profile-header-card">
          <div className="profile-avatar">{initial}</div>
          <div className="profile-header-info">
            <div className="profile-name">{profile.fullName}</div>
            <div className="profile-meta">
              <span className="profile-role-badge">{profile.role}</span>
              <span className="profile-email">{profile.email}</span>
            </div>
          </div>
        </div>

        {message && <div className="banner" style={{ background: "#E5F6EA", borderColor: "#1B7A3D", color: "#1B7A3D" }}>{message}</div>}
        {error && <div className="banner">{error}</div>}

        {/* Personal Details */}
        <div className="profile-card">
          <div className="profile-card-header">
            <span className="profile-card-title">Personal Details</span>
            {!isEditing && (
              <button className="profile-link-btn" onClick={handleEdit}>Edit</button>
            )}
          </div>

          {!isEditing ? (
            <div className="profile-fields-grid">
              <Field label="Full name" value={profile.fullName} />
              <Field label="Phone number" value={profile.phoneNumber} />
              <Field label="Address line 1" value={profile.addressLine1} />
              <Field label="Address line 2" value={profile.addressLine2} />
              <Field label="City" value={profile.city} />
              <Field label="State" value={profile.state} />
              <Field label="Country" value={profile.country} />
              <Field label="Postal code" value={profile.postalCode} />
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="field-group">
                <label>Full name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label>Phone number</label>
                <input name="phoneNumber" value={form.phoneNumber || ""} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label>Address line 1</label>
                <input name="addressLine1" value={form.addressLine1 || ""} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label>Address line 2</label>
                <input name="addressLine2" value={form.addressLine2 || ""} onChange={handleChange} />
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>City</label>
                  <input name="city" value={form.city || ""} onChange={handleChange} />
                </div>
                <div className="field-group">
                  <label>State</label>
                  <input name="state" value={form.state || ""} onChange={handleChange} />
                </div>
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>Country</label>
                  <input name="country" value={form.country || ""} onChange={handleChange} />
                </div>
                <div className="field-group">
                  <label>Postal code</label>
                  <input name="postalCode" value={form.postalCode || ""} onChange={handleChange} />
                </div>
              </div>

              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button type="button" className="btn-secondary" style={{ marginTop: 10 }} onClick={handleCancel}>
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* Security */}
        <div className="profile-card">
          <div className="profile-card-header">
            <span className="profile-card-title">Security</span>
            {!showPasswordForm && (
              <button className="profile-link-btn" onClick={() => setShowPasswordForm(true)}>
                Change Password
              </button>
            )}
          </div>

          {!showPasswordForm ? (
            <p style={{ fontSize: 14, color: "var(--muted)" }}>••••••••</p>
          ) : (
            <div>
              {pwMessage && <div className="banner" style={{ background: "#E5F6EA", borderColor: "#1B7A3D", color: "#1B7A3D" }}>{pwMessage}</div>}
              {pwError && <div className="banner">{pwError}</div>}

              <form onSubmit={handlePwSubmit}>
                <div className="field-group">
                  <label>Current password</label>
                  <input type="password" name="oldPassword" value={pwForm.oldPassword} onChange={handlePwChange} required />
                </div>
                <div className="field-group">
                  <label>New password</label>
                  <input type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} required minLength={6} />
                </div>
                <button className="btn-primary" type="submit" disabled={pwSaving}>
                  {pwSaving ? "Updating…" : "Update Password"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: 10 }}
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="profile-danger-card">
          <div className="profile-danger-text">
            <h3>Log out</h3>
            <p>End your current session on this device.</p>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>

      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="profile-field">
      <div className="profile-field-label">{label}</div>
      <div className={`profile-field-value ${!value ? "empty" : ""}`}>
        {value || "Not provided"}
      </div>
    </div>
  );
}