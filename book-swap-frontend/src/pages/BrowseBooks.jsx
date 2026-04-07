import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/BrowseBooks.css";

const categories = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Technology",
  "Literature",
  "Other",
];
const conditions = ["All", "New", "Like New", "Good", "Fair", "Poor"];

export default function BrowseBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/logout/", {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchBooks();
  }, [search, category, condition, location]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8000/api/books/?";
      if (search) url += `search=${search}&`;
      if (category !== "All") url += `category=${category}&`;
      if (condition !== "All") url += `condition=${condition}&`;
      if (location) url += `location=${location}&`;

      const response = await fetch(url, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="browse-page">
      <AppNav onLogout={handleLogout} />
      <AppSidebar />
      <main className="page-main">
        <h1 className="page-title">Browse Books</h1>

        <div className="browse-filters">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              {conditions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="Filter by city..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="location-filter"
            />
          </div>
        </div>

        <p className="results-count">{books.length} book(s) found</p>

        {loading ? (
          <p>Loading books...</p>
        ) : books.length > 0 ? (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-image-placeholder">
                  {book.image ? (
                    <img
                      src={`http://localhost:8000${book.image}`}
                      alt={book.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <span>📚</span>
                  )}
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <div className="book-tags">
                    <span className="tag">{book.category}</span>
                    <span className="tag">{book.condition}</span>
                  </div>
                </div>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No books found. Try adjusting your filters!</p>
          </div>
        )}
      </main>
    </div>
  );
}
