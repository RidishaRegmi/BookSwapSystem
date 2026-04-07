import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/SwapManagement.css";

export default function SwapManagement() {
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
      if (response.ok) {
        alert("Swap marked as completed!");
        fetchSwaps();
      }
    } catch (error) {
      console.error("Error completing swap:", error);
    }
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
                  <th>Meetup Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomingRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6">No incoming requests.</td>
                  </tr>
                ) : (
                  incomingRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.requested_book_title}</td>
                      <td>{req.offered_book_title}</td>
                      <td>{req.requester_name}</td>
                      <td>
                        <span
                          className={`status-badge ${req.status.toLowerCase()}`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.meetup_note ? (
                          <p className="existing-note">📝 {req.meetup_note}</p>
                        ) : null}
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
                  ))
                )}
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
                  <th>Meetup Note</th>
                </tr>
              </thead>
              <tbody>
                {sentRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5">No sent requests.</td>
                  </tr>
                ) : (
                  sentRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.requested_book_title}</td>
                      <td>{req.offered_book_title}</td>
                      <td>{req.recipient_name}</td>
                      <td>
                        <span
                          className={`status-badge ${req.status.toLowerCase()}`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.meetup_note ? (
                          <p className="existing-note">📝 {req.meetup_note}</p>
                        ) : null}
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
