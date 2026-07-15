import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getAllGyms } from "../../api/gymApi";
import "../member/member.css";
import "../gymOwner/owner.css";
import "./admin.css";

export default function GymList() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllGyms().then((res) => setGyms(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-shell">
      <Navbar />
      <div className="admin-content">
        <h1 className="page-heading">All Gyms</h1>
        <p className="page-sub">{gyms.length} gyms on the platform.</p>

        {loading && <p>Loading…</p>}

        {!loading && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Approved</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {gyms.map((g) => (
                <tr key={g.id}>
                  <td>{g.gymName}</td>
                  <td>{g.city}, {g.state}</td>
                  <td>{g.isApproved ? "Yes" : "No"}</td>
                  <td>{g.isActive ? "Yes" : "No"}</td>
                  <td>
                    <button className="btn-small outline" onClick={() => navigate(`/admin/gyms/${g.id}`)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}