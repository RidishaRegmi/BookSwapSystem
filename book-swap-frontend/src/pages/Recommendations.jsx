import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../components/AppSideBar";
import AppNav from "../components/AppNav";
import "../styles/Recommendations.css";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/books/recommendations/",
          { headers: { Authorization: `Token ${token}` } },
        );
        const data = await res.json();
        if (res.ok) {
          setRecommendations(data.recommendations);
          setIsPersonalized(data.is_personalized);
          setTopCategories(data.top_categories);
        } else {
          setError("Failed to load recommendations.");
        }
      } catch {
        setError("Network error. Make sure Django is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div
      className="recommendations-page"
      style={{ minHeight: "100vh", fontFamily: "Poppins, sans-serif" }}
    >
      <AppNav />
      <AppSidebar />
      <main className="page-main">
        {/* page header - matches browse books style */}
        <div className="page-header">
          <div>
            <h1 className="page-title"> Recommended For You</h1>
            <p className="page-subtitle">
              {isPersonalized
                ? `Based on your swap history — you enjoy: ${topCategories.join(", ")}`
                : "Popular books available for swap right now"}
            </p>
          </div>
          {isPersonalized && (
            <span className="personalized-badge"> Personalized</span>
          )}
        </div>

        {/* loading state */}
        {loading && (
          <div className="loading-state">Loading recommendations...</div>
        )}

        {/* error state */}
        {error && <div className="error-state">{error}</div>}

        {/* empty state */}
        {!loading && !error && recommendations.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <p>No recommendations yet</p>
            <span>
              Complete some swaps and we'll suggest books you'll love!
            </span>
          </div>
        )}

        {/* books grid - matches browse books style */}
        {!loading && !error && recommendations.length > 0 && (
          <>
            <p className="results-count">
              {recommendations.length} book(s) recommended
            </p>
            <div className="books-grid">
              {recommendations.map((book) => (
                <div
                  key={book.id}
                  className="book-card"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  {/* book image */}
                  <div className="book-image-placeholder">
                    {book.image ? (
                      <img src={book.image} alt={book.title} />
                    ) : (
                      <span>📖</span>
                    )}
                  </div>

                  {/* book info */}
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                    <div className="book-tags">
                      <span className="tag">{book.category}</span>
                      <span className="tag">{book.condition}</span>
                    </div>
                    <p className="book-owner">
                      by {book.owner.full_name || book.owner.email}
                    </p>
                  </div>

                  {/* view button */}
                  <button
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/${book.id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
