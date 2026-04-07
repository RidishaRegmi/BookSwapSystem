import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/BookDetails.css";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

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
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/books/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setBook(data);
        const profileRes = await fetch(
          "http://localhost:8000/api/auth/profile/",
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        const profileData = await profileRes.json();
        setCurrentUserId(profileData.id);
      } else {
        setError("Book not found.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div>
        <AppNav onLogout={handleLogout} />
        <AppSidebar />
        <main className="page-main">
          <p>Loading...</p>
        </main>
      </div>
    );

  if (error)
    return (
      <div>
        <AppNav onLogout={handleLogout} />
        <AppSidebar />
        <main className="page-main">
          <p>{error}</p>
        </main>
      </div>
    );

  return (
    <div>
      <AppNav onLogout={handleLogout} />
      <AppSidebar />
      <main className="page-main">
        <h1 className="page-title">Book Details</h1>
        <div className="bookdetails-card">
          <div className="bookdetails-content">
            <div className="bookdetails-image">
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
                <div className="image-placeholder">No Image</div>
              )}
            </div>
            <div className="bookdetails-info">
              <h2>{book.title}</h2>
              <div className="detail-row">
                <span className="detail-label">Author:</span> {book.author}
              </div>
              <div className="detail-row">
                <span className="detail-label">Category:</span> {book.category}
              </div>
              <div className="detail-row">
                <span className="detail-label">Condition:</span>
                <span className="condition-badge">{book.condition}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Listed by:</span>{" "}
                {book.owner_name}
              </div>
              <div className="detail-description">
                <span className="detail-label">Description:</span>
                <p>{book.description}</p>
              </div>
              {book.is_available_for_swap && book.owner !== currentUserId ? (
                <button
                  className="swap-btn"
                  onClick={() => navigate(`/swap-request/${id}`)}
                >
                  Request Swap
                </button>
              ) : book.owner === currentUserId ? (
                <p
                  style={{ color: "#888", fontSize: "14px", marginTop: "10px" }}
                >
                  This is your book.
                </p>
              ) : (
                <p
                  style={{ color: "#888", fontSize: "14px", marginTop: "10px" }}
                >
                  This book is no longer available for swap.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
