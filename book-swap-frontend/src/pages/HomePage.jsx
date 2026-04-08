import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/HomePage.css";
import logo from "../assets/bookswaplogo.jpg";
import homepagepic from "../assets/homepagepic.jpeg";

export default function HomePage() {
  const navigate = useNavigate();
  const [recentBooks, setRecentBooks] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/books/?limit=3");
        const data = await res.json();
        setRecentBooks(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch recent books:", err);
      }
    };
    fetchRecent();
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about").scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="homepage-wrapper">
      {/* Navbar */}
      <nav className="homepage-nav">
        <div
          className="nav-logo"
          style={{ cursor: "pointer" }}
          onClick={scrollToTop}
        >
          <img
            src={logo}
            alt="logo"
            style={{ width: "45px", height: "45px", objectFit: "contain" }}
          />
          Book Swap System
        </div>
        <div className="nav-links">
          <button onClick={scrollToTop}>Home</button>
          <button onClick={scrollToAbout}>About</button>
          <button onClick={() => navigate("/auth")}>Login</button>
          <button
            className="nav-register"
            onClick={() => navigate("/auth?mode=register")}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="homepage-hero" id="hero">
        <div className="hero-left">
          <div className="hero-left-inner">
            <div className="hero-eyebrow">Book Exchange Platform</div>
            <h1>
              Give your books a{" "}
              <span className="highlight">second chapter.</span>
            </h1>
            <p>
              Swap books with fellow readers and discover your next favourite
              read — no money, just stories.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate("/auth")}>
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-bubble hero-bubble-1" />
          <div className="hero-bubble hero-bubble-2" />
          <div className="hero-bubble hero-bubble-3" />
          <div className="hero-bubble hero-bubble-4" />
          <div className="hero-bubble hero-bubble-5" />
          <div className="hero-bubble hero-bubble-6" />
          <div className="hero-bubble hero-bubble-7" />
          <div className="hero-bubble hero-bubble-8" />

          <div className="hero-right-inner">
            <div className="hero-stats">
              <div>
                <div className="hero-stat-n">500+</div>
                <div className="hero-stat-l">Books Listed</div>
              </div>
              <div>
                <div className="hero-stat-n">120+</div>
                <div className="hero-stat-l">Readers</div>
              </div>
              <div>
                <div className="hero-stat-n">80+</div>
                <div className="hero-stat-l">Swaps</div>
              </div>
            </div>
            <div className="hero-books-label">Recently listed</div>
            <div className="hero-books">
              {recentBooks.length > 0
                ? recentBooks.map((book) => (
                    <div className="hero-book-card" key={book.id}>
                      <div className="hero-book-img">
                        {book.image ? (
                          <img
                            src={`http://localhost:8000${book.image}`}
                            alt={book.title}
                          />
                        ) : (
                          <div className="hero-book-placeholder" />
                        )}
                      </div>
                      <div>
                        <div className="hero-book-name">{book.title}</div>
                        <div className="hero-book-auth">{book.author}</div>
                      </div>
                      <span className="hero-book-tag">{book.condition}</span>
                    </div>
                  ))
                : [1, 2, 3].map((i) => (
                    <div className="hero-book-card" key={i}>
                      <div className="hero-book-img">
                        <div className="hero-book-placeholder" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            height: "12px",
                            borderRadius: "4px",
                            width: "70%",
                            marginBottom: "6px",
                          }}
                        />
                        <div
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            height: "10px",
                            borderRadius: "4px",
                            width: "50%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full width image */}
      <div className="homepage-img-banner">
        <img src={homepagepic} alt="Books" />
      </div>

      {/* About */}
      <section className="about-section" id="about">
        <div className="about-left">
          <h2>About Us</h2>
          <p>
            Book Swap System is a free online platform designed to connect book
            lovers who want to exchange books instead of buying new ones.
            Whether you have academic textbooks, fiction novels, self-help
            books, or reference materials you no longer need — someone else
            might be looking for exactly that.
          </p>
          <p>
            Our platform makes it easy to list your books, browse what others
            have, send swap requests, and complete exchanges — all in one place.
            No money involved, just books changing hands between readers.
          </p>
          <p>
            Books deserve to be read, not forgotten on a shelf. Every swap is a
            small step toward a more connected, sustainable, and well-read
            world.
          </p>
        </div>

        <div className="about-right">
          <div className="about-block">
            <h3>How It Works</h3>
            <div className="how-cards">
              <div className="how-card">
                <div className="how-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="#603226"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3>List Your Book</h3>
                <p>Upload books you're ready to exchange.</p>
              </div>
              <div className="how-card">
                <div className="how-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="#603226"
                      strokeWidth="2"
                    />
                    <path
                      d="M16.5 16.5L21 21"
                      stroke="#603226"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3>Find a Match</h3>
                <p>Browse books shared by readers near your location.</p>
              </div>
              <div className="how-card">
                <div className="how-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M7 16l-4-4 4-4M17 8l4 4-4 4"
                      stroke="#603226"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3>Swap & Enjoy</h3>
                <p>Exchange and start your next read.</p>
              </div>
            </div>
          </div>

          <hr className="about-divider" />

          <div className="about-block">
            <h3>What We Stand For</h3>
            <div className="values-cards">
              <div className="value-card">
                <div className="value-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"
                      stroke="#603226"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="#603226"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h4>Sustainability</h4>
                <p>
                  Give books a second life instead of letting them collect dust.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                      stroke="#603226"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx="9"
                      cy="7"
                      r="4"
                      stroke="#603226"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                      stroke="#603226"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h4>Community</h4>
                <p>
                  Connect with fellow readers who share your love for books.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z"
                      stroke="#603226"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h4>Affordability</h4>
                <p>
                  No money involved — just books changing hands between readers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="footer-logo">
              <img
                src={logo}
                alt="logo"
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
              BookSwap
            </div>
            <p>Swap books with fellow readers and discover new stories.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#" onClick={scrollToTop}>
              Home
            </a>
            <a href="#" onClick={scrollToAbout}>
              About
            </a>
            <a href="#" onClick={() => navigate("/auth")}>
              Login
            </a>
            <a href="#" onClick={() => navigate("/auth?mode=register")}>
              Register
            </a>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>bookswapsystem@gmail.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 BookSwap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
