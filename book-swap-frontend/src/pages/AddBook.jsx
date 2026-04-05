import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/AddBook.css";

export default function AddBook() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);
    formData.append("is_available_for_swap", true);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://localhost:8000/api/books/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Book added successfully!");
        navigate("/dashboard");
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to add book. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AppNav onLogout={handleLogout} />
      <AppSidebar />
      <main className="page-main">
        <h1 className="page-title">Add a New Book</h1>
        <div className="addbook-card">
          {error && (
            <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>
          )}
          <form className="addbook-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Book Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Technology">Technology</option>
                <option value="Literature">Literature</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the book..."
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Book Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Book"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
