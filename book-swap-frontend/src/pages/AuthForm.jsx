import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AuthForm.css";

export default function AuthForm() {
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

  const detectLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        );
        const data = await res.json();
        const city =
          data.address.city || data.address.town || data.address.village || "";
        setLocation(city);
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
        const res = await fetch("http://localhost:8000/api/auth/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            location,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        } else {
          setError(
            data.email?.[0] || data.password?.[0] || "Registration failed.",
          );
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
              <div className="location-row">
                <input
                  type="text"
                  placeholder="Your City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <button
                  type="button"
                  className="location-btn"
                  onClick={detectLocation}
                >
                  {locationLoading ? "..." : " Auto"}
                </button>
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
