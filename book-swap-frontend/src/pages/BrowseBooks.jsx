import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/BrowseBooks.css";

// Placeholder book data - will be replaced with real backend data later
const placeholderBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    condition: "Good",
    location: "Kathmandu",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-help",
    condition: "Like New",
    location: "Pokhara",
  },
  {
    id: 3,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Academic",
    condition: "Fair",
    location: "Kathmandu",
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    condition: "Good",
    location: "Lalitpur",
  },
  {
    id: 5,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    condition: "Like New",
    location: "Kathmandu",
  },
  {
    id: 6,
    title: "Deep Work",
    author: "Cal Newport",
    category: "Self-help",
    condition: "Good",
    location: "Bhaktapur",
  },
];

const categories = [
  "All",
  "Fiction",
  "Non-fiction",
  "Academic",
  "Self-help",
  "Reference",
];
const conditions = ["All", "Like New", "Good", "Fair"];
const locations = ["All", "Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur"];

export default function BrowseBooks() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [location, setLocation] = useState("All");

  const filtered = placeholderBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || book.category === category;
    const matchesCondition =
      condition === "All" || book.condition === condition;
    const matchesLocation = location === "All" || book.location === location;
    return (
      matchesSearch && matchesCategory && matchesCondition && matchesLocation
    );
  });

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title">Browse Books</h1>

        {/* Search and Filters */}
        <div className="browse-filters">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            {conditions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <p className="results-count">{filtered.length} book(s) found</p>

        {/* Books Grid */}
        {filtered.length > 0 ? (
          <div className="books-grid">
            {filtered.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-image-placeholder">
                  <span>📚</span>
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <div className="book-tags">
                    <span className="tag">{book.category}</span>
                    <span className="tag">{book.condition}</span>
                    <span className="tag location-tag">📍 {book.location}</span>
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
