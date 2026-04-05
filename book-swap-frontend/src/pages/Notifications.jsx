import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/notifications/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/notifications/${id}/read/`, {
        method: "PUT",
        headers: { Authorization: `Token ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return "Yesterday";
    return `${Math.floor(diff / 86400)} days ago`;
  };

  if (loading)
    return (
      <div className="page-wrapper">
        <Sidebar />
        <main className="page-main">
          <p>Loading...</p>
        </main>
      </div>
    );

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title">Notifications</h1>
        <div className="notif-list">
          {notifications.length === 0 ? (
            <p>No notifications yet.</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notif-item ${notif.is_read ? "" : "unread"}`}
                onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                style={{ cursor: notif.is_read ? "default" : "pointer" }}
              >
                <div className="notif-dot">
                  {!notif.is_read && <span className="dot" />}
                </div>
                <div className="notif-content">
                  <p className="notif-message">{notif.message}</p>
                  <span className="notif-time">
                    {formatTime(notif.created_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
