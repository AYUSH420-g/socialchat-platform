import axios from "axios";
import { useState, useEffect } from "react";
import "./Chat.css";

function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?.id || user?._id;

  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [replyMsg, setReplyMsg] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // DEBUG
  useEffect(() => {
    console.log("searchText:", searchText);
    console.log("searchResults:", searchResults);
  }, [searchResults]);

  // LOAD USERS
  useEffect(() => {
    if (!senderId) return;
    axios
      .get(`/api/users?exclude=${senderId}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Load users error:", err));
  }, [senderId]);

  // LOAD MESSAGES WHEN SELECTED
  useEffect(() => {
    if (senderId && receiverId) {
      loadMessages();
    }
  }, [receiverId, senderId]);

  // SEARCH USERS (debounced)
  useEffect(() => {
    if (searchText.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      axios
        .get(`/api/users/search?q=${searchText}`)
        .then((res) => setSearchResults(res.data))
        .catch((err) => console.log("Search error:", err));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  // AUTO SCROLL
  useEffect(() => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  async function loadMessages() {
    try {
      const res = await axios.get(
        `/api/chat/history/${senderId}/${receiverId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.log("Load messages error:", err);
    }
  }

  async function sendMsg() {
    if (!msg.trim() || !receiverId) return;

    try {
      await axios.post("/api/chat/send", {
        senderId,
        receiverId,
        message: msg,
        replyTo: replyMsg,
      });

      setMsg("");
      setReplyMsg(null);
      loadMessages();
    } catch (err) {
      console.log("Send error:", err.response?.data || err);
    }
  }

  if (!senderId) return <p>You must log in to chat.</p>;

  const displayedUsers =
    searchText.trim() === "" ? users : searchResults;

  const selectedUser = users.find((u) => u._id === receiverId);

  return (
    <div className="chat-layout">

      {/* ================= LEFT SEARCH + USER LIST ================= */}
      <div className="chat-list">
        
        {/* SEARCH INPUT + HEADER */}
        <div className="chat-list-search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input-top"
          />
          <div className="chat-list-header">Messages</div>
        </div>

        {displayedUsers.length === 0 && (
          <div className="empty-chat">No users found</div>
        )}

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
            <div className="avatar" />
            <span>{u.username}</span>
          </div>
        ))}
      </div>

      {/* ================= RIGHT CHAT WINDOW ================= */}
      <div className="chat-window">

        {!receiverId ? (
          <div className="empty-chat">Select a chat</div>
        ) : (
          <>
            <div className="chat-header">
              {selectedUser?.username || "Chat"}
            </div>

            <div className="chat-box">
              {messages.length === 0 && (
                <p className="empty-chat">No messages yet</p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`message ${
                    String(m.senderId) === String(senderId)
                      ? "sent"
                      : "received"
                  }`}
                >
                  {m.replyTo && (
                    <div className="reply-preview">
                      <span className="reply-user">
                        {String(m.replyTo.senderId) === String(senderId)
                          ? "You"
                          : selectedUser?.username}
                      </span>
                      <p>{m.replyTo.message}</p>
                    </div>
                  )}
                  <div className="message-text">{m.message}</div>
                  <span
                    className="reply-icon"
                    onClick={() =>
                      setReplyMsg({
                        _id: m._id,
                        message: m.message,
                        senderId: m.senderId,
                      })
                    }
                  >
                    ↩️
                  </span>
                </div>
              ))}
            </div>

            {replyMsg && (
              <div className="reply-box">
                <span>Replying to:</span>
                <p>{replyMsg.message}</p>
                <button onClick={() => setReplyMsg(null)}>✕</button>
              </div>
            )}

            <div className="chat-input">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMsg();
                }}
              />
              <button onClick={sendMsg}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
