import { useNavigate } from "react-router-dom";
import logo from "../assets/bookswaplogo.jpg";

export default function AppNav({ onLogout }) {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .app-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 200;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 60px;
          height: 70px;
          background: #ffffff;
          border-bottom: 1px solid #e5e0dd;
        }
        .app-nav .nav-logo {
          font-size: 22px;
          font-weight: 800;
          color: #603226;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        .app-nav .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .app-nav .nav-right button {
          background: transparent;
          border: none;
          font-size: 16px;
          font-family: "Poppins", sans-serif;
          color: #444;
          cursor: pointer;
          padding: 8px 20px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .app-nav .nav-right button:hover {
          background: #f5f0ee;
          color: #603226;
        }
        .app-nav .nav-logout {
          background: #603226 !important;
          color: white !important;
          border-radius: 20px !important;
        }
        .app-nav .nav-logout:hover {
          filter: brightness(1.12);
          background: #603226 !important;
        }
      `}</style>

      <nav className="app-nav">
        <div className="nav-logo" onClick={() => navigate("/dashboard")}>
          <img
            src={logo}
            alt="logo"
            style={{ width: "45px", height: "45px", objectFit: "contain" }}
          />
          Book Swap System
        </div>
        <div className="nav-right">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={() => navigate("/notifications")}>
            Notifications
          </button>
          <button className="nav-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
