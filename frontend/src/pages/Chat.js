import axios from "axios";
import { useState, useEffect } from "react";
import "./Chat.css";
import { formatLastSeen } from "../utils/time";
import { useNavigate } from "react-router-dom";

function Chat() {
  // ===============================
  // AUTH USER
  // ===============================
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?.id || user?._id;
  const navigate = useNavigate();

  // ===============================
  // STATE
  // ===============================
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [replyMsg, setReplyMsg] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [unreadMap, setUnreadMap] = useState({});

  // ===============================
  // LOAD USERS (includes online + lastSeen)
  // ===============================
  useEffect(() => {
    if (!senderId) return;

    axios
      .get(`/api/users?exclude=${senderId}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Load users error:", err));
  }, [senderId]);

  // ===============================
  // HEARTBEAT (STEP – ONLINE STATUS)
  // ===============================
  useEffect(() => {
    if (!senderId) return;

    const interval = setInterval(() => {
      axios.post("/api/users/heartbeat", { userId: senderId });
    }, 30000);

    return () => clearInterval(interval);
  }, [senderId]);

  // ===============================
  // UNREAD COUNT (BLUE DOT)
  // ===============================
  useEffect(() => {
    if (!senderId) return;

    axios
      .get(`/api/users/unread?userId=${senderId}`)
      .then((res) => {
        const map = {};
        res.data.forEach((item) => {
          map[item._id] = item.count;
        });
        setUnreadMap(map);
      })
      .catch((err) => console.log("Unread error:", err));
  }, [senderId, receiverId]);

  // ===============================
  // LOAD CHAT
  // ===============================
  useEffect(() => {
    if (senderId && receiverId) loadMessages();
  }, [receiverId, senderId]);

  // ===============================
  // SEARCH USERS
  // ===============================
  useEffect(() => {
    if (searchText.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      axios
        .get(`/api/users/search?q=${searchText}`)
        .then((res) => setSearchResults(res.data))
        .catch(() => {});
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  // ===============================
  // AUTO SCROLL
  // ===============================
  useEffect(() => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  // ===============================
  // API FUNCTIONS
  // ===============================
  async function loadMessages() {
    const res = await axios.get(
      `/api/chat/history/${senderId}/${receiverId}`
    );
    setMessages(res.data);
  }

  async function sendMsg() {
    if (!msg.trim() || !receiverId) return;

    await axios.post("/api/chat/send", {
      senderId,
      receiverId,
      message: msg,
      replyTo: replyMsg
    });

    setMsg("");
    setReplyMsg(null);
    loadMessages();
  }

  async function handleDelete(messageId) {
    await axios.delete(`/api/chat/message/${messageId}`, {
      data: { senderId }
    });

    setDeleteMsg(null);
    loadMessages();
  }

  if (!senderId) return <p>You must log in</p>;

  const displayedUsers =
    searchText.trim() === "" ? users : searchResults;

  const selectedUser = users.find((u) => u._id === receiverId);
  console.log(users);

  // ===============================
  // UI
  // ===============================
  return (
    <div className="page-container">
      {/* ================= HOME LEFT PANEL ================= */}
      <div className="home-left">
        <h1 className="home">Chat With Us</h1>

        <button className="chat-button" onClick={() => navigate("/home")}>
          🏠 Home
        </button>

        <button className="chat-button-ch">
          💬 Chat
        </button>

        <button className="chat-button" onClick={() => navigate("/profile")}>
          👤 Profile
        </button>

        <button
          className="home-logout"
          onClick={async () => {
            await axios.post("/api/users/logout", { userId: senderId });
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* ================= CHAT SECTION ================= */}
      <div className="chat-layout">
        {/* LEFT CHAT LIST */}
        <div className="chat-list">
          <input
            className="search-input-top"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="msg">Messages</div>
          {displayedUsers.map((u) => (
            <div
              key={u._id}
              className={`chat-user ${receiverId === u._id ? "active" : ""}`}
              onClick={() => {
                setReceiverId(u._id);
                setSearchText("");
                setSearchResults([]);
              }}
            >
              <div className="avatar">
                {u.username.charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                <span className="username">{u.username}</span>

                {!u.isOnline && u.lastSeen && (
                  <span className="last-seen">
                    last seen {formatLastSeen(u.lastSeen)}
                  </span>
                )}
              </div>


              {unreadMap[u._id] && receiverId !== u._id && (
                <span className="blue-dot"></span>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT CHAT WINDOW */}
        <div className="chat-window">
          {!receiverId ? (
            <div className="empty-chat">Select a chat</div>
          ) : (
            <>
              <div className="chat-header">
                {selectedUser?.username}
                {selectedUser?.isOnline && (
                  <span className="online-dot">● Online</span>
                )}
              </div>

              <div className="chat-box">
                {messages.map((m) => (
                  <div
                    key={m._id}
                    className={`message ${
                      String(m.senderId) === String(senderId)
                        ? "sent"
                        : "received"
                    }`}
                  >
                    {m.replyTo && (
                      <div className="reply-preview">
                        {m.replyTo.message}
                      </div>
                    )}

                    {m.message}

                    <span
                      className="reply-icon"
                      onClick={() =>
                        setReplyMsg({
                          _id: m._id,
                          message: m.message,
                          senderId: m.senderId
                        })
                      }
                    >
                      ↩️
                    </span>

                    {String(m.senderId) === String(senderId) && (
                      <span
                        className="delete-icon"
                        onClick={() => setDeleteMsg(m)}
                      >
                        🗑️
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {replyMsg && (
                <div className="reply-box">
                  {replyMsg.message}
                  <button onClick={() => setReplyMsg(null)}>✕</button>
                </div>
              )}

              {deleteMsg && (
                <div className="delete-confirm">
                  <button onClick={() => handleDelete(deleteMsg._id)}>
                    Delete
                  </button>
                  <button onClick={() => setDeleteMsg(null)}>Cancel</button>
                </div>
              )}

              <div className="chat-input">
                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Message..."
                  onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                />
                <button onClick={sendMsg}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
