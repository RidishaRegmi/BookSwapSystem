import { useState } from "react";
import "../styles/AuthForm.css";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const url = isLogin
    //   ? "http://localhost:8000/api/auth/login/"
    //   : "http://localhost:8000/api/auth/signup/";

    // const payload = { email, password };

    try {
      const res = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(email, password),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Success:", data);
        alert(isLogin ? "Logged in!" : "Account created!");
      } else {
        alert("Error: " + (data.error || JSON.stringify(data)));
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Is Django running?");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            {" "}
            Login{" "}
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            {" "}
            Register{" "}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
              <button type="submit">Login</button>
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

              {password !== confirmPassword && confirmPassword && (
                <p style={{ color: "red" }}>Passwords do not match!</p>
              )}
              <button type="submit" disabled={password !== confirmPassword}>
                Register
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
