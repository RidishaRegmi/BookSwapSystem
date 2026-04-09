import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSideBar";
import AppNav from "../components/AppNav";
import "../styles/Wishlist.css";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/books/wishlist/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setItems(data);
    } catch {
      setError("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("http://localhost:8000/api/books/wishlist/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), author: author.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        // add new item to list without refetching
        setItems([data, ...items]);
        setTitle("");
        setAuthor("");
        setSuccess(
          "Added to wishlist! You'll be notified when someone lists this book.",
        );
      } else {
        setError(data.detail || "Failed to add.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/books/wishlist/${id}/remove/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      // remove from list immediately without refetching
      setItems(items.filter((item) => item.id !== id));
    } catch {
      setError("Failed to remove.");
    }
  };

  return (
    <div
      className="wishlist-page"
      style={{ minHeight: "100vh", fontFamily: "Poppins, sans-serif" }}
    >
      <AppNav />
      <AppSidebar />
      <main className="page-main">
        {/* page header */}
        <div className="page-header">
          <h1 className="page-title"> My Wishlist</h1>
          <p className="page-subtitle">
            Add books you're looking for — get notified when someone lists them!
          </p>
        </div>

        {/* add to wishlist form */}
        <div className="wishlist-form-card">
          <h2 className="form-title">Add a Book to Wishlist</h2>
          <form onSubmit={handleAdd} className="wishlist-form">
            <div className="form-row">
              <div className="form-group">
                <label>Book Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Harry Potter"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="wishlist-input"
                />
              </div>
              <div className="form-group">
                <label>Author (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. J.K. Rowling"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="wishlist-input"
                />
              </div>
              <button type="submit" className="add-btn" disabled={adding}>
                {adding ? "Adding..." : "+ Add to Wishlist"}
              </button>
            </div>
            {error && <p className="wishlist-error">{error}</p>}
            {success && <p className="wishlist-success">{success}</p>}
          </form>
        </div>

        {/* wishlist items */}
        <div className="wishlist-section">
          <h2 className="section-title">
            Your Wishlist
            <span className="wishlist-count">{items.length}</span>
          </h2>

          {loading && <p className="loading-text">Loading wishlist...</p>}

          {!loading && items.length === 0 && (
            <div className="empty-wishlist">
              <div className="empty-icon"></div>
              <p>Your wishlist is empty</p>
              <span>
                Add books above and we'll notify you when they're listed!
              </span>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="wishlist-grid">
              {items.map((item) => (
                <div key={item.id} className="wishlist-card">
                  <div className="wishlist-card-icon">📖</div>
                  <div className="wishlist-card-info">
                    <h3>{item.title}</h3>
                    {item.author && <p>{item.author}</p>}
                    <span className="wishlist-date">
                      Added {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.id)}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
