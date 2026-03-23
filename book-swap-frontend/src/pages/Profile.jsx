import Sidebar from "../components/Sidebar.jsx";
import "../styles/Profile.css";

export default function Profile() {
  // Placeholder data - will be replaced with real backend data later
  const user = {
    fullName: "User Full Name",
    email: "user@example.com",
  };

  const swapHistory = [
    {
      bookTitle: "Book Title 1",
      partner: "Swap Partner A",
      date: "2025-01-15",
      status: "Completed",
    },
    {
      bookTitle: "Book Title 2",
      partner: "Swap Partner B",
      date: "2025-02-20",
      status: "Completed",
    },
    {
      bookTitle: "Book Title 3",
      partner: "Swap Partner C",
      date: "2025-03-10",
      status: "Pending",
    },
  ];

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title">User Profile</h1>

        {/* User Info Card */}
        <div className="profile-card">
          <h2>User Information</h2>
          <div className="profile-info">
            <p>
              <span>Name:</span> {user.fullName}
            </p>
            <p>
              <span>Email:</span> {user.email}
            </p>
          </div>
          <button className="edit-btn">Edit Profile</button>
        </div>

        {/* Swap History */}
        <div className="profile-card">
          <h2>Swap History</h2>
          <table className="swap-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Partner</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {swapHistory.map((swap, index) => (
                <tr key={index}>
                  <td>{swap.bookTitle}</td>
                  <td>{swap.partner}</td>
                  <td>{swap.date}</td>
                  <td>
                    <span
                      className={`status-badge ${swap.status.toLowerCase()}`}
                    >
                      {swap.status}
                    </span>
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
