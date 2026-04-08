import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "My Profile", path: "/profile" },
    { label: "My Books", path: "/add-book" },
    { label: "Browse Books", path: "/browse" },
    { label: "Swap Requests", path: "/swap-management" },
    { label: "Notifications", path: "/notifications" },
    { label: "Chats", path: "/chats" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Book Swap System</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
        <button className="logout-btn" onClick={() => navigate("/auth")}>
          Logout
        </button>
      </nav>
    </aside>
  );
}
