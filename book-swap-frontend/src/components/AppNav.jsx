import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/bookswaplogo.jpg";

export default function AppNav({ onLogout }) {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUnread = async () => {
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
    if (token) fetchUnread();
  }, []);

  return (
    <>
      <style>{`
        .app-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 200;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          height: 90px;
          background: #ffffff;
          border-bottom: 1px solid #e5e0dd;
        }
        .nav-logo {
          font-size: 24px;
          font-weight: 800;
          color: #603226;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .nav-icon-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          color: #603226;
          transition: background 0.15s;
        }
        .nav-icon-btn:hover { background: #f5f0ee; }
        .nav-icon-btn.logout {
          background: #603226;
          color: white;
        }
        .nav-icon-btn.logout:hover { background: #7a3e31; }
        .nav-divider {
          width: 1px;
          height: 24px;
          background: #e5e0dd;
          margin: 0 8px;
        }
        .notif-badge {
          position: absolute;
          top: 2px; right: 2px;
          background: #603226;
          color: white;
          border-radius: 50%;
          width: 17px; height: 17px;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }
      `}</style>

      <nav className="app-nav">
        <div className="nav-logo" onClick={() => navigate("/dashboard")}>
          <img
            src={logo}
            alt="logo"
            style={{ width: "40px", height: "40px", objectFit: "contain" }}
          />
          BookSwap
        </div>
        <div className="nav-right">
          {/* Profile */}
          <button
            className="nav-icon-btn"
            title="Profile"
            onClick={() => navigate("/profile")}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="nav-divider" />

          {/* Notifications */}
          <button
            className="nav-icon-btn"
            title="Notifications"
            onClick={() => navigate("/notifications")}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M6 10a6 6 0 0112 0v4l2 2H4l2-2v-4z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M10 18a2 2 0 004 0"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          <div className="nav-divider" />

          {/* Logout */}
          <button
            className="nav-icon-btn logout"
            title="Logout"
            onClick={onLogout}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}
