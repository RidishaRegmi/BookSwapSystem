import Sidebar from "../components/Sidebar";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const users = [
    { id: 1, fullName: "Jane Smith", email: "jane@example.com" },
    { id: 2, fullName: "John Doe", email: "john@example.com" },
    { id: 3, fullName: "Alice Brown", email: "alice@example.com" },
    { id: 4, fullName: "Bob Wilson", email: "bob@example.com" },
  ];

  const bookListings = [
    {
      id: 101,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      status: "Approved",
    },
    { id: 102, title: "1984", author: "George Orwell", status: "Pending" },
    {
      id: 103,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      status: "Rejected",
    },
    {
      id: 104,
      title: "Brave New World",
      author: "Aldous Huxley",
      status: "Approved",
    },
  ];

  const handleBlockUser = (id) => {
    alert("User " + id + " blocked!");
  };

  const handleRemoveUser = (id) => {
    alert("User " + id + " removed!");
  };

  const handleApproveBook = (id) => {
    alert("Book " + id + " approved!");
  };

  const handleRejectBook = (id) => {
    alert("Book " + id + " rejected!");
  };

  const handleRemoveBook = (id) => {
    alert("Book " + id + " removed!");
  };

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
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
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
              ))}
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookListings.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <span
                      className={`status-badge ${book.status.toLowerCase()}`}
                    >
                      {book.status}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button
                      className="action-btn approve"
                      onClick={() => handleApproveBook(book.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="action-btn reject"
                      onClick={() => handleRejectBook(book.id)}
                    >
                      Reject
                    </button>
                    <button
                      className="action-btn remove"
                      onClick={() => handleRemoveBook(book.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
