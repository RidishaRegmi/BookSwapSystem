import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/SwapRequest.css";

export default function SwapRequest() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState("");
  const [message, setMessage] = useState("");

  const requestedBook = {
    id: bookId,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    condition: "Good",
  };

  const myBooks = [
    { id: 1, title: "To Kill a Mockingbird" },
    { id: 2, title: "1984" },
    { id: 3, title: "Pride and Prejudice" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Swap request submitted!");
    navigate("/swap-management");
  };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title">Request a Swap</h1>

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
