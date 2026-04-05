import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ full_name: "User" });
  const [stats, setStats] = useState({
    listedBooks: 0,
    activeSwaps: 0,
    completedSwaps: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const profileRes = await fetch(
        "http://localhost:8000/api/auth/profile/",
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      const profileData = await profileRes.json();
      setUser(profileData);

      const booksRes = await fetch(
        "http://localhost:8000/api/books/my-books/",
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      const booksData = await booksRes.json();

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
      const activeSwaps = allSwaps.filter(
        (s) => s.status === "Pending" || s.status === "Accepted",
      ).length;
      const completedSwaps = allSwaps.filter(
        (s) => s.status === "Completed",
      ).length;

      setStats({
        listedBooks: booksData?.length || 0,
        activeSwaps,
        completedSwaps,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <AppNav onLogout={handleLogout} />
      <AppSidebar onLogout={handleLogout} />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>
            Welcome, <span>{user.full_name}!</span>
          </h1>
          <p className="dashboard-date">{today}</p>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <p className="stat-label">Listed Books</p>
            <p className="stat-number">{stats.listedBooks}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Active Swap Requests</p>
            <p className="stat-number">{stats.activeSwaps}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Completed Swaps</p>
            <p className="stat-number">{stats.completedSwaps}</p>
          </div>
        </div>

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
