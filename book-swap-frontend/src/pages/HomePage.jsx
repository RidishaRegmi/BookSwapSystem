import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import logo from "../assets/bookswaplogo.jpg";
import heroBook from "../assets/herobook.jpg";

export default function HomePage() {
  const navigate = useNavigate();

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
          <h1>
            Give Your Books a<br />
            <span className="highlight">Second Chapter.</span>
          </h1>
          <p>Swap books with fellow readers and discover new stories.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/auth")}>
              Get Started
            </button>
          </div>
        </div>
        <div className="hero-right">
          <img src={heroBook} alt="Reading a book" className="hero-image" />
        </div>
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
            might be looking for exactly that. Our platform makes it simple,
            fast, and completely free to give your books a second life while
            discovering your next great read.
          </p>
          <p>
            Our platform makes it easy to list your books, browse what others
            have, send swap requests, and complete exchanges — all in one place.
            No money involved, just books changing hands between readers. Simply
            create an account, upload the books you wish to swap, and browse
            listings from fellow readers. When you find a book you want, send a
            swap request and connect directly with the owner to arrange the
            exchange.
          </p>
          <p>
            Books deserve to be read, not forgotten on a shelf. Book Swap System
            was built with the belief that knowledge and stories should be
            accessible to everyone, regardless of budget. By swapping instead of
            buying, you save money, reduce waste, and become part of a growing
            community of readers who believe in the power of sharing. Every swap
            is a small step toward a more connected, sustainable, and well-read
            world.
          </p>
        </div>

        <div className="about-right">
          <div className="about-block">
            <h3>How It Works</h3>
            <div className="how-cards">
              <div className="how-card">
                <div className="how-icon">📝</div>
                <h3>List Your Book</h3>
                <p>Upload books you're ready to exchange.</p>
              </div>
              <div className="how-card">
                <div className="how-icon">🔍</div>
                <h3>Find a Match</h3>
                <p>Browse books shared by readers near your location.</p>
              </div>
              <div className="how-card">
                <div className="how-icon">🤝</div>
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
                <div className="value-icon">♻️</div>
                <h4>Sustainability</h4>
                <p>
                  Give books a second life instead of letting them collect dust.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h4>Community</h4>
                <p>
                  Connect with fellow readers who share your love for books.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">💸</div>
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
        <div className="footer-left">
          <div className="footer-logo">
            <img
              src={logo}
              alt="logo"
              style={{ width: "28px", height: "28px", objectFit: "contain" }}
            />
            Book Swap System
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
        <div className="footer-bottom">
          <p>© 2025 Book Swap System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
