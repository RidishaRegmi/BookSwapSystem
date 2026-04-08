import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import AppSidebar from "../components/AppSideBar";
import "../styles/SwapManagement.css";

export default function ChatsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUserId = JSON.parse(localStorage.getItem("user") || "{}").id;
  const [acceptedSwaps, setAcceptedSwaps] = useState([]);
  const [selectedChatSwap, setSelectedChatSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchAcceptedSwaps();
  }, [token, navigate]);

  useEffect(() => {
    if (!selectedChatSwap) return;
    fetchMessages(selectedChatSwap.id);
    if (selectedChatSwap.status === "Accepted") {
      const interval = setInterval(
        () => fetchMessages(selectedChatSwap.id),
        3000,
      );
      return () => clearInterval(interval);
    }
  }, [selectedChatSwap]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const fetchAcceptedSwaps = async () => {
    try {
      const [incomingRes, sentRes] = await Promise.all([
        fetch("http://localhost:8000/api/swaps/incoming/", {
          headers: { Authorization: `Token ${token}` },
        }),
        fetch("http://localhost:8000/api/swaps/sent/", {
          headers: { Authorization: `Token ${token}` },
        }),
      ]);
      const incoming = await incomingRes.json();
      const sent = await sentRes.json();
      const allSwaps = [...incoming, ...sent].filter(
        (swap) => swap.status === "Accepted" || swap.status === "Completed",
      );
      setAcceptedSwaps(allSwaps);
      if (!selectedChatSwap && allSwaps.length > 0)
        setSelectedChatSwap(allSwaps[0]);
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (swapId) => {
    try {
      setChatLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/swaps/${swapId}/messages/`,
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
        setChatError("");
      } else setChatError(data.detail || "Unable to load chat.");
    } catch (error) {
      setChatError("Unable to load chat.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChatSwap) return;
    const trimmed = messageInput.trim();
    if (!trimmed) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/swaps/${selectedChatSwap.id}/messages/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: trimmed }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, data]);
        setMessageInput("");
        setChatError("");
      } else setChatError(data.detail || "Unable to send message.");
    } catch (error) {
      setChatError("Unable to send message.");
    }
  };

  return (
    <div>
      <AppNav onLogout={handleLogout} />
      <AppSidebar />
      <main className="page-main">
        <div className="page-header">
          <h1 className="page-title">Chats</h1>
        </div>

        {loading ? (
          <p>Loading chats...</p>
        ) : acceptedSwaps.length === 0 ? (
          <div className="swap-card">
            <p>No chats yet. Accept a swap request to start chatting.</p>
          </div>
        ) : (
          <>
            <div className="swap-card">
              <h3 style={{ marginBottom: "10px", color: "#603226" }}>
                Swap conversations
              </h3>
              <div className="action-cell" style={{ flexWrap: "wrap" }}>
                {acceptedSwaps.map((swap) => (
                  <button
                    key={swap.id}
                    className={`action-btn ${selectedChatSwap?.id === swap.id ? "chat" : "complete"}`}
                    onClick={() => {
                      setSelectedChatSwap(swap);
                      setMessages([]);
                      setMessageInput("");
                    }}
                  >
                    {swap.offered_book_title} ↔ {swap.requested_book_title}
                    {swap.status === "Completed" && (
                      <span
                        style={{
                          fontSize: "11px",
                          marginLeft: "6px",
                          opacity: 0.7,
                        }}
                      >
                        (completed)
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedChatSwap && (
              <section className="chat-card">
                <div className="chat-header">
                  <h2>Swap Chat</h2>
                  <span
                    className={`status-badge ${selectedChatSwap.status.toLowerCase()}`}
                  >
                    {selectedChatSwap.status}
                  </span>
                </div>
                <p className="chat-context">
                  {selectedChatSwap.offered_book_title} ↔{" "}
                  {selectedChatSwap.requested_book_title}
                </p>
                <div className="chat-messages">
                  {chatLoading && messages.length === 0 ? (
                    <p>Loading chat...</p>
                  ) : messages.length === 0 ? (
                    <p>No messages yet. Start the conversation.</p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`chat-bubble ${String(msg.sender) === String(currentUserId) ? "mine" : "theirs"}`}
                      >
                        <p className="chat-sender">{msg.sender_name}</p>
                        <p>{msg.content}</p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {chatError && <p className="chat-error">{chatError}</p>}
                {selectedChatSwap.status === "Completed" ? (
                  <p
                    style={{
                      color: "#888",
                      fontSize: "13px",
                      textAlign: "center",
                      marginTop: "8px",
                    }}
                  >
                    This swap is completed. Chat is read-only.
                  </p>
                ) : (
                  <div className="chat-compose">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                      }}
                    />
                    <button
                      className="action-btn accept"
                      onClick={handleSendMessage}
                    >
                      Send
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
