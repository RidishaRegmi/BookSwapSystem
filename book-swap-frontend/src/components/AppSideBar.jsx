import { useNavigate } from "react-router-dom";

export default function AppSidebar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .app-sidebar {
          width: 240px;
          min-height: 100vh;
          background-color: #603226;
          display: flex;
          flex-direction: column;
          padding: 30px 20px;
          gap: 10px;
          position: fixed;
          top: 70px;
          left: 0;
          bottom: 0;
        }
        .app-sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .app-sidebar nav button {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.85);
          font-size: 15px;
          font-family: "Poppins", sans-serif;
          font-weight: 400;
          text-align: left;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .app-sidebar nav button:hover {
          background: rgba(255,255,255,0.15);
          color: #ffffff;
        }
        .app-sidebar .logout-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          font-family: "Poppins", sans-serif;
          text-align: left;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .app-sidebar .logout-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #ffffff;
        }
      `}</style>

      <aside className="app-sidebar">
        <nav>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/add-book")}>My Books</button>
          <button onClick={() => navigate("/browse")}>Browse Books</button>
          <button onClick={() => navigate("/swap-management")}>
            Swap Requests
          </button>
          <button className="nav-btn" onClick={() => navigate("/map")}>
            Map
          </button>
        </nav>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </aside>
    </>
  );
}
