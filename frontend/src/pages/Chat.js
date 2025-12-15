import axios from "axios";
import { useState, useEffect } from "react";
import "./Chat.css";

function Chat() {
  // Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?.id || user?._id;

  // State
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  
  useEffect(() => {
    if (!senderId) return;

    axios
      .get(`/api/users?exclude=${senderId}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Load users error:", err));
  }, [senderId]);

 
  useEffect(() => {
    if (senderId && receiverId) {
      loadMessages();
    }
  }, [receiverId, senderId]);

  
  useEffect(() => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
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
        message: msg
      });

      setMsg("");
      loadMessages();
    } catch (err) {
      console.log("Send error:", err.response?.data || err);
    }
  }

  // ===============================
  // UI
  // ===============================
  if (!senderId) {
    return <p>You must log in to chat.</p>;
  }

  return (
    <div className="chat-layout">
      {/* ================= LEFT USER LIST ================= */}
      <div className="chat-list">
        <div className="chat-list-header">Messages</div>

        {users.length === 0 && (
          <div className="empty-chat">No users found</div>
        )}

        {users.map((u) => (
          <div
            key={u._id}
            className={`chat-user ${
              receiverId === u._id ? "active" : ""
            }`}
            onClick={() => setReceiverId(u._id)}
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
              Chat
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
                  {m.message}
                </div>
              ))}
            </div>

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
