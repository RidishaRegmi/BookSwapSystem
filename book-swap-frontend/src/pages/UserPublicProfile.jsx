import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/SwapManagement.css";

export default function UserPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/auth/users/${id}/map-profile/`,
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token, navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/logout/", {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div>
      <AppNav onLogout={handleLogout} />
      <AppSidebar />
      <main className="page-main">
        {loading ? (
          <p>Loading profile...</p>
        ) : !profile ? (
          <p>Unable to load this user profile.</p>
        ) : (
          <div className="swap-card">
            <h1 className="page-title">{profile.name}</h1>
            <p>📍 {profile.city}</p>
            {profile.profile_image && (
              <img
                src={profile.profile_image}
                alt={`${profile.name} profile`}
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "12px 0",
                }}
              />
            )}
            <h3>Available Books</h3>
            {profile.available_books.length === 0 ? (
              <p>No books currently available.</p>
            ) : (
              <ul>
                {profile.available_books.map((book) => (
                  <li key={book.id}>
                    {book.title} by {book.author} ({book.condition})
                    {String(profile.id) !== String(currentUser.id) ? (
                      <button
                        type="button"
                        className="action-btn chat"
                        style={{ marginLeft: "10px" }}
                        onClick={() => navigate(`/swap-request/${book.id}`)}
                      >
                        Swap This Book
                      </button>
                    ) : (
                      <span style={{ marginLeft: "10px", color: "#666" }}>
                        Your book
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <h3 style={{ marginTop: "18px" }}>Swap History</h3>
            {!profile.swap_history || profile.swap_history.length === 0 ? (
              <p>No swap history yet.</p>
            ) : (
              <ul>
                {profile.swap_history.map((swap) => (
                  <li key={swap.id}>
                    {swap.offered_book_title} ↔ {swap.requested_book_title} -{" "}
                    {swap.status} (with {swap.counterparty_name})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
