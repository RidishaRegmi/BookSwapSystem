import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="homepage-wrapper">
      {/* Navbar */}
      <nav className="homepage-nav">
        <div
          className="nav-logo"
          style={{ cursor: "pointer" }}
          onClick={() => setShowAbout(false)}
        >
          Book Swap System
        </div>
        <div className="nav-links">
          <button onClick={() => setShowAbout(false)}>Home</button>
          <button onClick={() => setShowAbout(true)}>About</button>
          <button onClick={() => navigate("/auth")}>Login</button>
          <button className="nav-register" onClick={() => navigate("/auth")}>
            Register
          </button>
        </div>
      </nav>

      {/* Home View */}
      {!showAbout && (
        <>
          <div className="homepage-hero" id="hero">
            <div className="hero-left">
              <h1>
                <span style={{ display: "block", whiteSpace: "nowrap" }}>
                  Give Your Books a
                </span>
                <span
                  style={{ display: "block", whiteSpace: "nowrap" }}
                  className="highlight"
                >
                  Second Chapter.
                </span>
              </h1>
              <p style={{ whiteSpace: "nowrap" }}>
                Swap books with fellow readers and discover new stories.
              </p>
              <div className="hero-buttons">
                <button
                  className="btn-primary"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>

          <section className="how-section">
            <h2>How It Works</h2>
            <p className="how-subtitle">Three simple steps to start swapping</p>
            <div className="how-cards">
              <div className="how-card">
                <div className="how-icon">📝</div>
                <h3>List Your Book</h3>
                <p>Upload books you're ready to exchange.</p>
              </div>
              <div className="how-card">
                <div className="how-icon">🔍</div>
                <h3>Find a Match</h3>
                <p>Browse books shared by other readers.</p>
              </div>
              <div className="how-card">
                <div className="how-icon">🤝</div>
                <h3>Swap & Enjoy</h3>
                <p>Exchange and start your next read.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* About View */}
      {showAbout && (
        <section className="about-section">
          <h2>About Book Swap System</h2>
          <p>
            Book Swap System is a free online platform designed to connect book
            lovers who want to exchange books instead of buying new ones.
            Whether you have academic textbooks, fiction novels, self-help books
            or reference materials you no longer need — someone else might be
            looking for exactly that.
          </p>
          <p>
            Our platform makes it easy to list your books, browse what others
            have, send swap requests and complete exchanges — all in one place.
            No money involved, just books changing hands between readers.
          </p>
        </section>
      )}
    </div>
  );
}
