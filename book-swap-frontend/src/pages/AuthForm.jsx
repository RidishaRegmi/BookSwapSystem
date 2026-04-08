import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/AuthForm.css";

export default function AuthForm() {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  function PinSelector({ lat, lng, onSelect }) {
    useMapEvents({
      click(e) {
        onSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    if (lat == null || lng == null) return null;
    return <Marker position={[lat, lng]} />;
  }

  const routerLocation = useLocation();
  const [isLogin, setIsLogin] = useState(
    routerLocation.search !== "?mode=register",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const navigate = useNavigate();
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const defaultMapCenter = useMemo(() => [28.3949, 84.124], []);
  const normalizeCoord = (value) =>
    value == null || Number.isNaN(Number(value))
      ? null
      : Number(Number(value).toFixed(6));

  const applyLocationFromCoordinates = async (nextLat, nextLng) => {
    const safeLat = normalizeCoord(nextLat);
    const safeLng = normalizeCoord(nextLng);
    setLat(safeLat);
    setLng(safeLng);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${safeLat}&lon=${safeLng}&format=json&addressdetails=1`,
      );
      const data = await res.json();
      const detectedCity =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.municipality ||
        "";
      const detectedArea =
        data.address?.suburb ||
        data.address?.neighbourhood ||
        data.address?.hamlet ||
        data.address?.road ||
        "";

      const composed = [detectedArea, detectedCity].filter(Boolean).join(", ");
      if (composed) setLocation(composed);
    } catch {
      // Keep raw coordinates even if reverse geocoding fails.
    }
  };

  const detectLocation = () => {
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        await applyLocationFromCoordinates(latitude, longitude);
        setLocationLoading(false);
      },
      () => {
        setError("Could not detect location. Please type manually.");
        setLocationLoading(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const res = await fetch("http://localhost:8000/api/auth/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        } else {
          setError(data.non_field_errors?.[0] || "Invalid email or password.");
        }
      } else {
        // REGISTER
        if (lat == null || lng == null) {
          setError("Please select your exact location pin on the map.");
          setLoading(false);
          return;
        }
        const res = await fetch("http://localhost:8000/api/auth/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            city: location,
            lat: normalizeCoord(lat),
            lng: normalizeCoord(lng),
          }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        } else {
          const firstError =
            data.email?.[0] ||
            data.password?.[0] ||
            data.city?.[0] ||
            data.lat?.[0] ||
            data.lng?.[0] ||
            data.non_field_errors?.[0] ||
            data.detail ||
            Object.values(data || {}).flat?.()[0];
          setError(firstError || "Registration failed.");
        }
      }
    } catch (err) {
      setError("Network error. Make sure Django is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

          {isLogin ? (
            <>
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <p>
                Don't have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(false);
                  }}
                >
                  Register
                </a>
              </p>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div className="location-row location-row-city">
                <input
                  type="text"
                  placeholder="Your City"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setLat(null);
                    setLng(null);
                  }}
                />
                <button
                  type="button"
                  className="location-btn"
                  onClick={detectLocation}
                >
                  {locationLoading ? "..." : " Auto"}
                </button>
              </div>
              <p
                style={{
                  color: "#603226",
                  fontSize: "12px",
                  textAlign: "left",
                }}
              >
                Selected location: {location || "Not set"}
              </p>
              <p
                style={{
                  color: "#603226",
                  fontSize: "12px",
                  textAlign: "left",
                }}
              >
                Pin:{" "}
                {lat != null && lng != null
                  ? `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`
                  : "Not set"}
              </p>
              <div className="pin-map-card">
                <p className="pin-map-title">
                  Click on map to set your exact pin location
                </p>
                <MapContainer
                  center={
                    lat != null && lng != null ? [lat, lng] : defaultMapCenter
                  }
                  zoom={lat != null && lng != null ? 13 : 7}
                  scrollWheelZoom
                  className="auth-pin-map"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <PinSelector
                    lat={lat}
                    lng={lng}
                    onSelect={(nextLat, nextLng) => {
                      applyLocationFromCoordinates(nextLat, nextLng);
                    }}
                  />
                </MapContainer>
              </div>
              {password !== confirmPassword && confirmPassword && (
                <p style={{ color: "red", fontSize: "13px" }}>
                  Passwords do not match!
                </p>
              )}
              <button
                type="submit"
                disabled={password !== confirmPassword || loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
