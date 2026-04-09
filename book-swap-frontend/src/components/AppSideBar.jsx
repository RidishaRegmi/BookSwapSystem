import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/swaps/incoming/", {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        setPendingCount(data.filter((s) => s.status === "Pending").length);
      } catch (err) {
        console.error("Error fetching pending swaps:", err);
      }
    };
    if (token) fetchPending();
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        .app-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 240px;
          height: 100vh;
          background: #3d1f17;
          display: flex;
          flex-direction: column;
          z-index: 99;
        }
        .sb-logo {
          padding: 20px 18px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
        }
        .sb-logo-icon {
          width: 34px;
          height: 34px;
          background: #c07850;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sb-logo-text {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          font-family: "Poppins", sans-serif;
        }
        .sb-nav {
          flex: 1;
          padding: 10px 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }
        .sb-section {
          padding: 20px 14px 8px;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: "Poppins", sans-serif;
        }
        .sb-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 15px;
          border-radius: 10px;
          color: #c9a89e;
          font-size: 17px;
          font-family: "Poppins", sans-serif;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
        }
        .sb-item:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }
        .sb-item.active {
          background: rgba(192,120,80,0.22);
          color: #f5c5a3;
        }
        .sb-item svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          opacity: 0.7;
        }
        .sb-item.active svg,
        .sb-item:hover svg { opacity: 1; }
        .sb-badge {
          margin-left: auto;
          background: #c07850;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 10px;
          font-family: "Poppins", sans-serif;
        }
        .sb-footer {
          padding: 12px 10px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .sb-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
        }
        .sb-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #c07850;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
          font-family: "Poppins", sans-serif;
        }
        .sb-username {
          font-size: 15px;
          color: #e8d5cc;
          font-weight: 600;
          font-family: "Poppins", sans-serif;
        }
        .sb-role {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          font-family: "Poppins", sans-serif;
        }
      `}</style>

      <aside className="app-sidebar">
        <div className="sb-logo" onClick={() => navigate("/dashboard")}>
          <div className="sb-logo-icon">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 6h16M4 10h16M4 14h10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="sb-logo-text">BookSwap</span>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">Main</div>

          <div
            className={`sb-item ${isActive("/dashboard") ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            <svg fill="none" viewBox="0 0 24 24">
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
            Dashboard
          </div>

          <div
            className={`sb-item ${isActive("/add-book") ? "active" : ""}`}
            onClick={() => navigate("/add-book")}
          >
            <svg fill="none" viewBox="0 0 24 24">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Add Book
          </div>

          <div
            className={`sb-item ${isActive("/browse") ? "active" : ""}`}
            onClick={() => navigate("/browse")}
          >
            <svg fill="none" viewBox="0 0 24 24">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M16.5 16.5L21 21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Browse Books
          </div>

          {/* recommendations nav item */}
          <div
            className={`sb-item ${isActive("/recommendations") ? "active" : ""}`}
            onClick={() => navigate("/recommendations")}
          >
            <svg fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            Recommendations
          </div>

          {/* wishlist nav item */}
          <div
            className={`sb-item ${isActive("/wishlist") ? "active" : ""}`}
            onClick={() => navigate("/wishlist")}
          >
            <svg fill="none" viewBox="0 0 24 24">
              <path
                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            Wishlist
          </div>

          <div className="sb-section">Activity</div>

          <div
            className={`sb-item ${isActive("/swap-management") ? "active" : ""}`}
            onClick={() => navigate("/swap-management")}
          >
            <svg fill="none" viewBox="0 0 24 24">
              <path
                d="M7 16l-4-4 4-4M17 8l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Swap Requests
            {pendingCount > 0 && (
              <span className="sb-badge">{pendingCount}</span>
            )}
          </div>

          <div
            className={`sb-item ${isActive("/chats") ? "active" : ""}`}
            onClick={() => navigate("/chats")}
          >
            <svg fill="none" viewBox="0 0 24 24">
              <path
                d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            Chats
          </div>

          <div
            className={`sb-item ${isActive("/map") ? "active" : ""}`}
            onClick={() => navigate("/map")}
          >
            <svg fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 8v4l2 2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Map
          </div>
        </nav>

        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-avatar">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <div className="sb-username">{user.full_name || "User"}</div>
              <div className="sb-role">Member</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
