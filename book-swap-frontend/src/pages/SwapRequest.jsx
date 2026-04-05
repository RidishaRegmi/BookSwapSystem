import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/SwapRequest.css";

export default function SwapRequest() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState("");
  const [message, setMessage] = useState("");
  const [requestedBook, setRequestedBook] = useState(null);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch the requested book details
      const bookRes = await fetch(
        `http://localhost:8000/api/books/${bookId}/`,
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      const bookData = await bookRes.json();
      setRequestedBook(bookData);

      // Fetch my books to offer
      const myBooksRes = await fetch(
        "http://localhost:8000/api/books/my-books/",
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      const myBooksData = await myBooksRes.json();
      setMyBooks(myBooksData);
    } catch (err) {
      setError("Something went wrong loading the data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/swaps/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_requested: bookId,
          book_offered: selectedBook,
          message: message,
        }),
      });

      if (response.ok) {
        alert("Swap request submitted!");
        navigate("/swap-management");
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to submit swap request.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="page-wrapper">
        <Sidebar />
        <main className="page-main">
          <p>Loading...</p>
        </main>
      </div>
    );

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title">Request a Swap</h1>

        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

        {requestedBook && (
          <div className="swapreq-card">
            <h2>Requested Book</h2>
            <div className="swapreq-bookinfo">
              <p>
                <span>Title:</span> {requestedBook.title}
              </p>
              <p>
                <span>Author:</span> {requestedBook.author}
              </p>
              <p>
                <span>Condition:</span> {requestedBook.condition}
              </p>
            </div>
          </div>
        )}

        <div className="swapreq-card">
          <h2>Your Offer</h2>
          <form className="swapreq-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select a book to offer</label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                required
              >
                <option value="">-- Choose one of your books --</option>
                {myBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to the book owner..."
                rows="4"
              />
            </div>
            <button type="submit" className="submit-btn">
              Submit Swap Request
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
