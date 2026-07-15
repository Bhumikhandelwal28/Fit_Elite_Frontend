import React from "react";
import { useNavigate } from "react-router-dom";
import "./CloseButton.css";

export default function CloseButton() {
  const navigate = useNavigate();
  return (
    <button
      className="close-btn"
      onClick={() => navigate("/")}
      aria-label="Back to home"
    >
      ×
    </button>
  );
}