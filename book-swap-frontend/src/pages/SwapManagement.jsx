import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/SwapManagement.css";

export default function SwapManagement() {
  const [activeTab, setActiveTab] = useState("incoming");

  const incomingRequests = [
    {
      id: 1,
      requestedBook: "The Great Gatsby",
      offeredBook: "To Kill a Mockingbird",
      requester: "John Doe",
      status: "Pending",
    },
    {
      id: 2,
      requestedBook: "1984",
      offeredBook: "Brave New World",
      requester: "Alice Brown",
      status: "Accepted",
    },
    {
      id: 3,
      requestedBook: "Pride and Prejudice",
      offeredBook: "Jane Eyre",
      requester: "Bob Wilson",
      status: "Rejected",
    },
  ];

  const sentRequests = [
    {
      id: 4,
      requestedBook: "The Catcher in the Rye",
      offeredBook: "The Great Gatsby",
      recipient: "Sarah Miller",
      status: "Pending",
    },
    {
      id: 5,
      requestedBook: "Moby Dick",
      offeredBook: "1984",
      recipient: "Tom Clark",
      status: "Completed",
    },
  ];

  const handleAccept = (id) => {
    alert("Request " + id + " accepted!");
  };

  const handleReject = (id) => {
    alert("Request " + id + " rejected!");
  };

  const handleComplete = (id) => {
    alert("Swap " + id + " marked as completed!");
  };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="page-main">
        <h1 className="page-title">Swap Management</h1>

        <div className="swap-tabs">
          <button
            className={activeTab === "incoming" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("incoming")}
          >
            Incoming Requests
          </button>
          <button
            className={activeTab === "sent" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("sent")}
          >
            Sent Requests
          </button>
        </div>

        <div className="swap-card">
          {activeTab === "incoming" ? (
            <table className="swap-table">
              <thead>
                <tr>
                  <th>Requested Book</th>
                  <th>Offered Book</th>
                  <th>Requester</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomingRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.requestedBook}</td>
                    <td>{req.offeredBook}</td>
                    <td>{req.requester}</td>
                    <td>
                      <span
                        className={`status-badge ${req.status.toLowerCase()}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="action-cell">
                      {req.status === "Pending" && (
                        <>
                          <button
                            className="action-btn accept"
                            onClick={() => handleAccept(req.id)}
                          >
                            Accept
                          </button>
                          <button
                            className="action-btn reject"
                            onClick={() => handleReject(req.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {req.status === "Accepted" && (
                        <button
                          className="action-btn complete"
                          onClick={() => handleComplete(req.id)}
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="swap-table">
              <thead>
                <tr>
                  <th>Requested Book</th>
                  <th>Offered Book</th>
                  <th>Recipient</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sentRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.requestedBook}</td>
                    <td>{req.offeredBook}</td>
                    <td>{req.recipient}</td>
                    <td>
                      <span
                        className={`status-badge ${req.status.toLowerCase()}`}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
