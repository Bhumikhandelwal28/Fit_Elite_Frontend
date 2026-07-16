import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileIcon() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/profile")}
      aria-label="My Profile"
      style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "var(--ink)", color: "var(--paper)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 14,
      }}
    >
      👤
    </button>
  );
}