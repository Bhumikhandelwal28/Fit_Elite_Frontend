import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getUsersByRole } from "../../api/adminApi";
import "../member/member.css";
import "./admin.css";

export default function UserList() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUsersByRole(role).then((res) => setUsers(res.data)).finally(() => setLoading(false));
  }, [role]);

  return (
    <div className="admin-shell">
      <Navbar />
      <div className="admin-content">
        <h1 className="page-heading">{role ? `${role}s` : "All Users"}</h1>
        <p className="page-sub">{users.length} total</p>

        {loading && <p>Loading…</p>}
        {!loading && users.length === 0 && <div className="empty-state">No users found.</div>}

        {users.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {role === "Member" && <th>Current Gym</th>}
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  {role === "Member" && (
                    <td>
                      {u.currentGymName ? (
                        u.currentGymName
                      ) : (
                        <span style={{ color: "var(--muted)" }}>No active plan</span>
                      )}
                    </td>
                  )}
                  <td>
                    <span className={`status-badge status-${u.isActive ? "Active" : "Cancelled"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(u.createdOn).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>

  );
}
