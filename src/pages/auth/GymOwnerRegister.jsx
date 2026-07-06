import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerGymOwner } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import "./auth.css";

const initialState = {
  fullName: "", email: "", password: "", phoneNumber: "",
  gym: {
    gymName: "", addressLine1: "", addressLine2: "", city: "",
    state: "", country: "", postalCode: "", contactNumber: "", email: ""
  }
};

export default function GymOwnerRegister() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handlePersonalChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleGymChange = (e) =>
    setForm({ ...form, gym: { ...form.gym, [e.target.name]: e.target.value } });

  const goNext = (e) => {
    e.preventDefault();
    setError("");
    setStep(2);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    const payload = {
      ...form,
      gym: {
        ...form.gym,
        email: form.gym.email?.trim() === "" ? null : form.gym.email,
        addressLine2: form.gym.addressLine2?.trim() === "" ? null : form.gym.addressLine2,
      }
    };
    const res = await registerGymOwner(payload);
    loginUser(res.data);
    navigate("/owner/dashboard");
  } catch (err) {
  const data = err.response?.data;

  let message = "Registration failed. Please try again.";

  if (data?.message) {
    message = data.message;
  } else if (data?.errors) {
   
    const firstKey = Object.keys(data.errors)[0];
    message = data.errors[firstKey]?.[0] || message;
  }

  setError(message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="auth-shell">
      <span className="auth-brand">Fit_Elite</span>
      <div className="auth-card wide">
        <div className="plate-track">
          <div className={`plate ${step >= 1 ? "filled" : ""}`} />
          <div className={`plate ${step >= 2 ? "filled" : ""}`} />
        </div>
        <span className="step-label">Step {step} of 2</span>

        {error && <div className="banner">{error}</div>}

        {step === 1 && (
          <>
            <h2 className="auth-title">Your details</h2>
            <p className="auth-caption">Let's start with who's running the gym.</p>
            <form onSubmit={goNext}>
              <div className="field-group">
                <label>Full name</label>
                <input name="fullName" value={form.fullName} onChange={handlePersonalChange} required />
              </div>
              <div className="field-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handlePersonalChange} required />
              </div>
              
                <div className="field-group">
                  <label>Phone number</label>
                  <input name="phoneNumber" value={form.phoneNumber} onChange={handlePersonalChange} />
                </div>
                <div className="field-group">
                  <label>Password</label>
                  <input type="password" name="password" value={form.password} onChange={handlePersonalChange} required minLength={6} />
                </div>
             
              <button className="btn-primary" type="submit">Continue to gym details</button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="auth-title">Gym details</h2>
            <p className="auth-caption">Opening & closing hours can be added later from your dashboard.</p>
            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label>Gym name</label>
                <input name="gymName" value={form.gym.gymName} onChange={handleGymChange} required />
              </div>
              <div className="field-group">
                <label>Address line 1</label>
                <input name="addressLine1" value={form.gym.addressLine1} onChange={handleGymChange} required />
              </div>
              <div className="field-group">
                <label>Address line 2 (optional)</label>
                <input name="addressLine2" value={form.gym.addressLine2} onChange={handleGymChange} />
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>City</label>
                  <input name="city" value={form.gym.city} onChange={handleGymChange} required />
                </div>
                <div className="field-group">
                  <label>State</label>
                  <input name="state" value={form.gym.state} onChange={handleGymChange} required />
                </div>
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>Country</label>
                  <input name="country" value={form.gym.country} onChange={handleGymChange} required />
                </div>
                <div className="field-group">
                  <label>Postal code</label>
                  <input name="postalCode" value={form.gym.postalCode} onChange={handleGymChange} required />
                </div>
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>Gym contact number</label>
                  <input name="contactNumber" value={form.gym.contactNumber} onChange={handleGymChange} required />
                </div>
                <div className="field-group">
                  <label>Gym email (optional)</label>
                  <input type="email" name="email" value={form.gym.email} onChange={handleGymChange} />
                </div>
              </div>

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Setting up your gym…" : "Register gym & create account"}
              </button>
              <button type="button" className="btn-secondary" style={{ marginTop: 10 }} onClick={() => setStep(1)}>
                Back
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}