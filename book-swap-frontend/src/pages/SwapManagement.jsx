import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/SwapManagement.css";

export default function SwapManagement() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [activeTab, setActiveTab] = useState("incoming");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetupNotes, setMeetupNotes] = useState({});
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    try {
      const incomingRes = await fetch(
        "http://localhost:8000/api/swaps/incoming/",
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      const incomingData = await incomingRes.json();
      setIncomingRequests(incomingData);

      const sentRes = await fetch("http://localhost:8000/api/swaps/sent/", {
        headers: { Authorization: `Token ${token}` },
      });
      const sentData = await sentRes.json();
      setSentRequests(sentData);
    } catch (error) {
      console.error("Error fetching swaps:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/swaps/${id}/accept/`,
        {
          method: "PUT",
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (response.ok) {
        alert("Request accepted!");
        fetchSwaps();
      }
    } catch (error) {
      console.error("Error accepting swap:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/swaps/${id}/reject/`,
        {
          method: "PUT",
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (response.ok) {
        alert("Request rejected!");
        fetchSwaps();
      }
    } catch (error) {
      console.error("Error rejecting swap:", error);
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/swaps/${id}/complete/`,
        {
          method: "PUT",
          headers: { Authorization: `Token ${token}` },
        },
      );
      const data = await response.json();
      if (response.ok) {
        alert(
          data.status === "Completed"
            ? "Swap completed by both parties!"
            : "Marked completed. Waiting for the other user to confirm.",
        );
        fetchSwaps();
      }
    } catch (error) {
      console.error("Error completing swap:", error);
    }
  };

  const handleCancelSwap = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/swaps/${id}/cancel/`,
        {
          method: "PUT",
          headers: { Authorization: `Token ${token}` },
        },
      );
      const data = await response.json();
      if (response.ok) {
        alert("Active swap cancelled. No books were exchanged.");
        fetchSwaps();
      } else alert(data.detail || "Failed to cancel swap.");
    } catch (error) {
      console.error("Error cancelling swap:", error);
    }
  };

  const getCompletionStatusLabel = (req) => {
    const isRequester = String(req.requester) === String(currentUser.id);
    const iMarked = isRequester
      ? req.requester_marked_completed
      : req.owner_marked_completed;
    const otherMarked = isRequester
      ? req.owner_marked_completed
      : req.requester_marked_completed;
    if (req.status === "Completed") return "Completed";
    if (iMarked && otherMarked) return "Completed";
    if (iMarked) return "Waiting for other user";
    if (otherMarked) return "Other user confirmed";
    return "Not confirmed";
  };

  const handleSaveMeetupNote = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/swaps/${id}/meetup-note/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ meetup_note: meetupNotes[id] || "" }),
        },
      );
      if (response.ok) {
        alert("Meetup note saved!");
        fetchSwaps();
      }
    } catch (error) {
      console.error("Error saving meetup note:", error);
    }
  };

  const renderTable = (requests, isIncoming) => (
    <table className="swap-table">
      <thead>
        <tr>
          <th>Requested Book</th>
          <th>Offered Book</th>
          <th>{isIncoming ? "Requester" : "Recipient"}</th>
          <th>Status</th>
          <th>Completion</th>
          <th>Meetup Note</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests.length === 0 ? (
          <tr>
            <td colSpan="7">No {isIncoming ? "incoming" : "sent"} requests.</td>
          </tr>
        ) : (
          requests.map((req) => (
            <tr key={req.id}>
              <td>{req.requested_book_title}</td>
              <td>{req.offered_book_title}</td>
              <td>{isIncoming ? req.requester_name : req.recipient_name}</td>
              <td>
                <span className={`status-badge ${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </td>
              <td>{getCompletionStatusLabel(req)}</td>
              <td>
                {req.meetup_note && (
                  <p className="existing-note">📝 {req.meetup_note}</p>
                )}
                {req.status === "Accepted" && (
                  <div className="meetup-note-cell">
                    <textarea
                      className="meetup-input"
                      placeholder="Add meetup note..."
                      value={meetupNotes[req.id] || ""}
                      onChange={(e) =>
                        setMeetupNotes({
                          ...meetupNotes,
                          [req.id]: e.target.value,
                        })
                      }
                      rows="2"
                    />
                    <button
                      className="action-btn complete"
                      onClick={() => handleSaveMeetupNote(req.id)}
                    >
                      Save Note
                    </button>
                  </div>
                )}
              </td>
              <td className="action-cell">
                {req.status === "Pending" && isIncoming && (
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
                  <>
                    <button
                      className="action-btn complete"
                      disabled={
                        String(req.requester) === String(currentUser.id)
                          ? req.requester_marked_completed
                          : req.owner_marked_completed
                      }
                      onClick={() => handleComplete(req.id)}
                    >
                      {String(req.requester) === String(currentUser.id)
                        ? req.requester_marked_completed
                          ? "Marked by You"
                          : "Mark Completed"
                        : req.owner_marked_completed
                          ? "Marked by You"
                          : "Mark Completed"}
                    </button>
                    <button
                      className="action-btn reject"
                      onClick={() => handleCancelSwap(req.id)}
                    >
                      Cancel Swap
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  if (loading)
    return (
      <div>
        <AppNav onLogout={handleLogout} />
        <AppSidebar />
        <main className="page-main">
          <p>Loading...</p>
        </main>
      </div>
    );

  return (
    <div>
      <AppNav onLogout={handleLogout} />
      <AppSidebar />
      <main className="page-main">
        <div className="page-header">
          <h1 className="page-title">Swap Management</h1>
        </div>

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
          {activeTab === "incoming"
            ? renderTable(incomingRequests, true)
            : renderTable(sentRequests, false)}
        </div>
      </main>
    </div>
  );
}
