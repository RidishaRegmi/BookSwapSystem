import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState({ full_name: "", email: "" });
  const [swapHistory, setSwapHistory] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchProfile();
    fetchSwapHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/profile/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await response.json();
      setUser(data);
      setEditName(data.full_name);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSwapHistory = async () => {
    try {
      const incomingRes = await fetch(
        "http://localhost:8000/api/swaps/incoming/",
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      const incomingData = await incomingRes.json();

      const sentRes = await fetch("http://localhost:8000/api/swaps/sent/", {
        headers: { Authorization: `Token ${token}` },
      });
      const sentData = await sentRes.json();

      const allSwaps = [...(incomingData || []), ...(sentData || [])];
      setSwapHistory(allSwaps);
    } catch (error) {
      console.error("Error fetching swap history:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/profile/", {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name: editName }),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/logout/", {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (loading)
    return (
      <div>
        <AppNav onLogout={handleLogout} />
        <AppSidebar />
        <main className="page-main">
          <p>Loading...</p>
        </main>
      </div>
    );

  return (
    <div>
      <AppNav onLogout={handleLogout} />
      <AppSidebar />
      <main className="page-main">
        <h1 className="page-title">User Profile</h1>

        <div className="profile-card">
          <h2>User Information</h2>
          <div className="profile-info">
            <p>
              <span>Name:</span>{" "}
              {editing ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              ) : (
                user.full_name
              )}
            </p>
            <p>
              <span>Email:</span> {user.email}
            </p>
          </div>
          {editing ? (
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="edit-btn" onClick={handleEditSave}>
                Save
              </button>
              <button className="edit-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="edit-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-card">
          <h2>Swap History</h2>
          <table className="swap-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Partner</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {swapHistory.length === 0 ? (
                <tr>
                  <td colSpan="4">No swap history yet.</td>
                </tr>
              ) : (
                swapHistory.map((swap, index) => (
                  <tr key={index}>
                    <td>{swap.book_requested_title}</td>
                    <td>{swap.requester_name || swap.owner_name}</td>
                    <td>{new Date(swap.created_at).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`status-badge ${swap.status.toLowerCase()}`}
                      >
                        {swap.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
