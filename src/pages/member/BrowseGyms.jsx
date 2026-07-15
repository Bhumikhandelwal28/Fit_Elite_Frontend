import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getTopGyms } from "../../api/gymApi";
import "./member.css";

export default function BrowseGyms() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getTopGyms()
      .then((res) => setGyms(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="member-shell">
      <Navbar />
      <div className="member-content">
        <h1 className="page-heading">Browse Gyms</h1>
        <p className="page-sub">Find a gym near you and pick a plan that fits.</p>

        {loading && <p>Loading gyms…</p>}

        {!loading && gyms.length === 0 && (
          <div className="empty-state">No approved gyms available yet.</div>
        )}

        <div className="gym-grid">
          {gyms.map((gym) => (
            <div
              className="gym-card"
              key={gym.id}
              onClick={() => navigate(`/member/gyms/${gym.id}`)}
            >
              <div className="gym-card-name">{gym.gymName}</div>
              <div className="gym-card-location">{gym.city}, {gym.state}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}