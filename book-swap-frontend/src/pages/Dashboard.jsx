import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = {
    name: "Username",
    listedBooks: 0,
    activeSwaps: 0,
    completedSwaps: 0,
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">Book Swap System</div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/profile")}>My Profile</button>
          <button onClick={() => navigate("/add-book")}>My Books</button>
          <button onClick={() => navigate("/browse")}>Browse Books</button>
          <button onClick={() => navigate("/swap-management")}>
            Swap Requests
          </button>
          <button onClick={() => navigate("/notifications")}>
            Notifications
          </button>
          <button className="logout-btn" onClick={() => navigate("/auth")}>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>
            Welcome, <span>{user.name}!</span>
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <p className="stat-label">Listed Books</p>
            <p className="stat-number">{user.listedBooks}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Active Swap Requests</p>
            <p className="stat-number">{user.activeSwaps}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Completed Swaps</p>
            <p className="stat-number">{user.completedSwaps}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button onClick={() => navigate("/add-book")}>
              + Add New Book
            </button>
            <button onClick={() => navigate("/browse")}>Browse Books</button>
            <button onClick={() => navigate("/swap-management")}>
              View Swap Requests
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
