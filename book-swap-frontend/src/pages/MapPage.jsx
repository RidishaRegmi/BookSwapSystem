import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/MapPage.css";

// --- Leaflet default-marker fix for Vite ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [users, setUsers] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/auth/users/locations/",
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to load map users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/logout/", {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const loadUserProfile = async (userId) => {
    if (userProfiles[userId]) return;
    try {
      const res = await fetch(
        `http://localhost:8000/api/auth/users/${userId}/map-profile/`,
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (!res.ok) return;
      const data = await res.json();
      setUserProfiles((prev) => ({ ...prev, [userId]: data }));
    } catch (err) {
      console.error("Failed to load map user profile:", err);
    }
  };

  if (loading) {
    return (
      <div>
        <AppNav onLogout={handleLogout} />
        <AppSidebar />
        <main className="map-page">
          <p
            style={{ textAlign: "center", marginTop: "50px", color: "#6D5A50" }}
          >
            Loading map...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <AppNav onLogout={handleLogout} />
      <AppSidebar />
      <main className="map-page">
        <div className="page-header" style={{ marginBottom: "8px" }}>
          <h1 className="page-title">Fellow Readers</h1>
        </div>

        <p className="map-subtitle">
          {users.length > 0
            ? `${users.length} book swapper${users.length !== 1 ? "s" : ""} near you`
            : "Be the first to join!"}
        </p>

        <div className="map-card">
          <MapContainer
            center={[28.3949, 84.124]}
            zoom={7}
            scrollWheelZoom={true}
            className="leaflet-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {users.map((user) => (
              <Marker key={user.id} position={[user.lat, user.lng]}>
                <Popup eventHandlers={{ add: () => loadUserProfile(user.id) }}>
                  <div className="map-user-tooltip">
                    <div className="map-user-header">
                      {userProfiles[user.id]?.profile_image ? (
                        <img
                          src={userProfiles[user.id].profile_image}
                          alt={`${user.name} profile`}
                          className="map-user-avatar"
                        />
                      ) : (
                        <div className="map-user-avatar map-user-avatar-fallback">
                          {(user.name || "U")[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <strong>
                          {String(user.id) === String(currentUser.id)
                            ? "Me"
                            : user.name}
                        </strong>
                        <p>📍 {user.city}</p>
                      </div>
                    </div>

                    <p className="map-tooltip-title">Available books</p>
                    <ul className="map-books-list">
                      {(userProfiles[user.id]?.available_books || [])
                        .slice(0, 4)
                        .map((book) => (
                          <li key={book.id}>
                            {book.title} - {book.author}
                          </li>
                        ))}
                      {userProfiles[user.id] &&
                        userProfiles[user.id].available_books.length === 0 && (
                          <li>No available books</li>
                        )}
                      {!userProfiles[user.id] && <li>Loading books...</li>}
                    </ul>

                    <div className="map-tooltip-actions">
                      <button
                        className="map-action-btn"
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}
