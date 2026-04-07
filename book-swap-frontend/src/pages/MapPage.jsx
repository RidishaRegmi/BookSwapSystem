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
  const [users, setUsers] = useState([]);
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
        <h1 className="page-title">🇳🇵 Fellow Readers in Nepal</h1>
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
                <Popup>
                  <strong>{user.name}</strong>
                  <br />
                  📍 {user.city}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}
