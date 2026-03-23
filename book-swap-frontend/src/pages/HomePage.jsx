import "../styles/HomePage.css";
export default function HomePage() {
  return (
    <div className="homepage">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-left">
          <div className="logo">BookSwap</div>
        </div>

        <div className="navbar-center">
          <input
            type="text"
            className="search-input"
            placeholder="Search for books..."
          />
        </div>

        <div className="navbar-right">
          <button className="nav-btn">Profile</button>
          <button className="nav-btn nav-logout">Logout</button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="home-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1>Welcome to BookSwap</h1>
          <p>
            Discover, share, and swap books with other readers. Keep your shelf
            fresh without spending a lot.
          </p>
          <button className="primary-btn">Browse Books</button>
        </section>

        {/* What's New Section */}
        <section className="whats-new">
          <h2>What’s new on BookSwap</h2>
          <div className="book-cards">
            <div className="book-card">
              <h3>New arrivals</h3>
              <p>See the latest books listed by other users.</p>
            </div>
            <div className="book-card">
              <h3>Popular swaps</h3>
              <p>Check out books that many users are interested in.</p>
            </div>
            <div className="book-card">
              <h3>Recommended for you</h3>
              <p>Personalised suggestions based on your interests.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
