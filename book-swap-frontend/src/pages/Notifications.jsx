import Sidebar from "../components/Sidebar";
import "../styles/Notifications.css";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      message:
        'Your swap request for "The Great Gatsby" has been accepted by Jane Smith.',
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      message: 'John Doe sent you a swap request for your book "1984".',
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      message:
        'Your swap for "To Kill a Mockingbird" has been marked as completed.',
      time: "Yesterday",
      read: true,
    },
    {
      id: 4,
      message:
        'Alice Brown rejected your swap request for "Pride and Prejudice".',
      time: "2 days ago",
      read: true,
    },
    {
      id: 5,
      message: 'New book "Brave New World" has been listed by Tom Clark.',
      time: "3 days ago",
      read: true,
    },
  ];

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title">Notifications</h1>
        <div className="notif-list">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notif-item ${notif.read ? "" : "unread"}`}
            >
              <div className="notif-dot">
                {!notif.read && <span className="dot" />}
              </div>
              <div className="notif-content">
                <p className="notif-message">{notif.message}</p>
                <span className="notif-time">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
