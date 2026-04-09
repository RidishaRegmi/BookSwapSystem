import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/Profile.css";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({ full_name: "", email: "" });
  const [swapHistory, setSwapHistory] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchProfile();
    fetchSwapHistory();
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/notifications/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

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
      const historyRes = await fetch(
        "http://localhost:8000/api/swaps/history/",
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      const historyData = await historyRes.json();
      setSwapHistory(historyData || []);
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
        // update localStorage so navbar shows new photo too
        localStorage.setItem("user", JSON.stringify(data));
        setImageFile(null);
        setImagePreview(null);
        alert("Profile photo updated!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("profile_image", imageFile);
    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/profile/upload-image/",
        {
          method: "PUT",
          headers: { Authorization: `Token ${token}` },
          body: formData,
        },
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setImageFile(null);
        setImagePreview(null);
        alert("Profile photo updated!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
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
        <AppNav onLogout={handleLogout} unreadCount={unreadCount} />
        <AppSidebar />
        <main className="page-main">
          <p>Loading...</p>
        </main>
      </div>
    );

  return (
    <div>
      <AppNav onLogout={handleLogout} unreadCount={unreadCount} />
      <AppSidebar />
      <main className="page-main">
        <div className="page-header">
          <h1 className="page-title">User Profile</h1>
        </div>

        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="avatar-circle">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="avatar-img" />
              ) : user.profile_image ? (
                <img
                  src={
                    user.profile_image.startsWith("http")
                      ? user.profile_image
                      : `http://localhost:8000${user.profile_image}`
                  }
                  alt="profile"
                  className="avatar-img"
                />
              ) : (
                <span className="avatar-placeholder">
                  {user.full_name
                    ? user.full_name.charAt(0).toUpperCase()
                    : "?"}
                </span>
              )}
            </div>
            <div className="avatar-actions">
              <label className="upload-label">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
              {imageFile && (
                <button className="edit-btn" onClick={handleImageUpload}>
                  Save Photo
                </button>
              )}
            </div>
          </div>

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
                    <td>{swap.requested_book_title}</td>
                    <td>{swap.requester_name || swap.recipient_name}</td>
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
