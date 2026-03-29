import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/BookDetails.css";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = {
    id: id,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    condition: "Good",
    description:
      "A classic novel about the American Dream set in the Jazz Age. The book is in good condition with minor wear on the cover. All pages are intact and clean. A must-read for anyone interested in American literature.",
    owner: "Jane Smith",
  };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title">Book Details</h1>
        <div className="bookdetails-card">
          <div className="bookdetails-content">
            <div className="bookdetails-image">
              <div className="image-placeholder">No Image</div>
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
                <span className="detail-label">Condition:</span>{" "}
                <span className="condition-badge">{book.condition}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Listed by:</span> {book.owner}
              </div>
              <div className="detail-description">
                <span className="detail-label">Description:</span>
                <p>{book.description}</p>
              </div>
              <button
                className="swap-btn"
                onClick={() => navigate(`/swap-request/${id}`)}
              >
                Request Swap
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
