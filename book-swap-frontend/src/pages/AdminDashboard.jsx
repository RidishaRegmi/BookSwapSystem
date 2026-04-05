import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookListings, setBookListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.is_admin) {
    navigate("/dashboard");
    return;
  }
  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await fetch("http://localhost:8000/api/admin/users/", {
        headers: { Authorization: `Token ${token}` },
      });
      const usersData = await usersRes.json();
      setUsers(usersData);

      const booksRes = await fetch("http://localhost:8000/api/admin/books/", {
        headers: { Authorization: `Token ${token}` },
      });
      const booksData = await booksRes.json();
      setBookListings(booksData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${id}/block/`,
        {
          method: "PUT",
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (response.ok) {
        alert("User blocked!");
        fetchData();
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleRemoveUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (response.ok) {
        alert("User removed!");
        fetchData();
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const handleRemoveBook = async (id) => {
    if (!window.confirm("Are you sure you want to remove this book?")) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/books/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (response.ok) {
        alert("Book removed!");
        fetchData();
      }
    } catch (error) {
      console.error("Error removing book:", error);
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
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="admin-card">
          <h2>User Management</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td className="action-cell">
                      <button
                        className="action-btn block"
                        onClick={() => handleBlockUser(user.id)}
                      >
                        Block
                      </button>
                      <button
                        className="action-btn remove"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h2>Book Listings Moderation</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookListings.length === 0 ? (
                <tr>
                  <td colSpan="5">No books found.</td>
                </tr>
              ) : (
                bookListings.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.owner_name}</td>
                    <td className="action-cell">
                      <button
                        className="action-btn remove"
                        onClick={() => handleRemoveBook(book.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
