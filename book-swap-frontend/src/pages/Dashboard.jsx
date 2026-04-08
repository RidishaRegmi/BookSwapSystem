import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ full_name: "User" });
  const [myBooks, setMyBooks] = useState([]);
  const [activeSwaps, setActiveSwaps] = useState([]);
  const [completedSwaps, setCompletedSwaps] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const token = localStorage.getItem("token");
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/notifications/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

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
    fetchDashboardData();
    fetchUnreadCount();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const profileRes = await fetch(
        "http://localhost:8000/api/auth/profile/",
        { headers: { Authorization: `Token ${token}` } },
      );
      const profileData = await profileRes.json();
      setUser(profileData);
      setCurrentUserId(profileData.id);

      const booksRes = await fetch(
        "http://localhost:8000/api/books/my-books/",
        { headers: { Authorization: `Token ${token}` } },
      );
      const booksData = await booksRes.json();
      setMyBooks(booksData || []);

      const historyRes = await fetch(
        "http://localhost:8000/api/swaps/history/",
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      const allSwaps = await historyRes.json();

      setActiveSwaps(
        (allSwaps || []).filter(
          (s) => s.status === "Pending" || s.status === "Accepted",
        ),
      );
      setCompletedSwaps(
        (allSwaps || []).filter((s) => s.status === "Completed"),
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard-root">
      <AppNav onLogout={handleLogout} unreadCount={unreadCount} />
      <AppSidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div className="bubble bubble-1" />
          <div className="bubble bubble-2" />
          <div className="bubble bubble-3" />
          <div className="dashboard-header-text">
            <h1>
              Welcome, <span>{user.full_name}!</span>
            </h1>
            <p className="dashboard-date">{today}</p>
          </div>

          <div className="dashboard-stats-row">
            <div className="mini-stat">
              <span className="mini-stat-num">{myBooks.length}</span>
              <span className="mini-stat-label">Books Listed</span>
            </div>
            <div className="mini-stat-divider" />
            <div className="mini-stat">
              <span className="mini-stat-num">{activeSwaps.length}</span>
              <span className="mini-stat-label">Active Swaps</span>
            </div>
            <div className="mini-stat-divider" />
            <div className="mini-stat">
              <span className="mini-stat-num">{completedSwaps.length}</span>
              <span className="mini-stat-label">Completed</span>
            </div>
          </div>
        </div>

        {/* My Listed Books */}
        <div className="library-section">
          <div className="section-header">
            <h2 className="section-title">
              My Listed Books
              <span className="section-count">{myBooks.length}</span>
            </h2>
          </div>

          {myBooks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <p className="empty-state-text">
                You haven't listed any books yet.
              </p>
              <button
                className="link-btn"
                onClick={() => navigate("/add-book")}
              >
                Add your first book →
              </button>
            </div>
          ) : (
            <div className="books-grid">
              {myBooks.map((book) => (
                <div
                  key={book.id}
                  className="lib-book-card"
                  onClick={() => navigate(`/book/${book.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="lib-book-image">
                    {book.image ? (
                      <img
                        src={`http://localhost:8000${book.image}`}
                        alt={book.title}
                      />
                    ) : (
                      <span className="book-placeholder">📖</span>
                    )}
                  </div>
                  <div className="lib-book-info">
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <span className="lib-tag">{book.condition}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Swap Requests */}
        <div className="library-section">
          <div className="section-header">
            <h2 className="section-title">
              Active Swap Requests
              <span className="section-count">{activeSwaps.length}</span>
            </h2>
          </div>

          {activeSwaps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔄</div>
              <p className="empty-state-text">No active swap requests.</p>
            </div>
          ) : (
            <div className="swap-grid">
              {activeSwaps.map((swap) => (
                <div key={swap.id} className="swap-book-card">
                  <div className="swap-books-row">
                    <div
                      className="swap-book-item"
                      onClick={() => navigate(`/book/${swap.requested_book}`)}
                    >
                      <div className="swap-book-img">
                        {swap.requested_book_image ? (
                          <img
                            src={swap.requested_book_image}
                            alt={swap.requested_book_title}
                          />
                        ) : (
                          <span>📚</span>
                        )}
                      </div>
                      <p className="swap-book-name">
                        {swap.requested_book_title}
                      </p>
                    </div>

                    <div className="swap-icon-wrapper">
                      <div className="swap-icon">⇄</div>
                    </div>

                    <div
                      className="swap-book-item"
                      onClick={() => navigate(`/book/${swap.offered_book}`)}
                    >
                      <div className="swap-book-img">
                        {swap.offered_book_image ? (
                          <img
                            src={swap.offered_book_image}
                            alt={swap.offered_book_title}
                          />
                        ) : (
                          <span>📚</span>
                        )}
                      </div>
                      <p className="swap-book-name">
                        {swap.offered_book_title}
                      </p>
                    </div>
                  </div>

                  <div className="swap-card-footer">
                    <p className="lib-swap-sub">
                      With{" "}
                      <strong>
                        {swap.requester === currentUserId
                          ? swap.recipient_name
                          : swap.requester_name}
                      </strong>
                    </p>
                    <span
                      className={`status-badge ${swap.status.toLowerCase()}`}
                    >
                      {swap.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Swaps */}
        <div className="library-section">
          <div className="section-header">
            <h2 className="section-title">
              Completed Swaps
              <span className="section-count section-count--green">
                {completedSwaps.length}
              </span>
            </h2>
          </div>

          {completedSwaps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <p className="empty-state-text">No completed swaps yet.</p>
            </div>
          ) : (
            <div className="swap-grid">
              {completedSwaps.map((swap) => (
                <div key={swap.id} className="swap-book-card completed">
                  <div className="swap-books-row">
                    <div
                      className="swap-book-item"
                      onClick={() => navigate(`/book/${swap.requested_book}`)}
                    >
                      <div className="swap-book-img">
                        {swap.requested_book_image ? (
                          <img
                            src={swap.requested_book_image}
                            alt={swap.requested_book_title}
                          />
                        ) : (
                          <span>📚</span>
                        )}
                      </div>
                      <p className="swap-book-name">
                        {swap.requested_book_title}
                      </p>
                    </div>

                    <div className="swap-icon-wrapper">
                      <div className="swap-icon">⇄</div>
                    </div>

                    <div
                      className="swap-book-item"
                      onClick={() => navigate(`/book/${swap.offered_book}`)}
                    >
                      <div className="swap-book-img">
                        {swap.offered_book_image ? (
                          <img
                            src={swap.offered_book_image}
                            alt={swap.offered_book_title}
                          />
                        ) : (
                          <span>📚</span>
                        )}
                      </div>
                      <p className="swap-book-name">
                        {swap.offered_book_title}
                      </p>
                    </div>
                  </div>

                  <div className="swap-card-footer">
                    <p className="lib-swap-sub">
                      With{" "}
                      <strong>
                        {swap.requester === currentUserId
                          ? swap.recipient_name
                          : swap.requester_name}
                      </strong>
                    </p>
                    <span className="status-badge completed">Completed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
