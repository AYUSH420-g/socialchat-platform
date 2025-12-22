import { useNavigate } from "react-router-dom";
import "./home.css";
import axios from "axios";

function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?.id || user?._id;


  async function handleLogout() {
  try {
    await axios.post("/api/users/logout", {
      userId: senderId
    });

    localStorage.clear();
    navigate("/login");

  } catch (err) {
    console.log("Logout error:", err);
  }
}

  return (
    <div className="home-container">
      {/* LEFT PANEL */}
      <div className="home-left">
        <h1 className="home">Chat With Us</h1>

        <button
          className="home-button-hm"
          onClick={() => navigate("/home")}
        >
          <span>🏠</span> Home
        </button>

        <button
          className="home-button"
          onClick={() => navigate("/chat/:receiverId")}
        >
          <span>💬</span> Messages
        </button>

        <button
          className="home-button"
          onClick={() => navigate("/profile")}
        >
          <span>👤</span> Profile
        </button>

        <button
          className="home-logout"
          onClick={handleLogout}
        >
          <span></span> Logout
        </button>
      </div>

      <div className="home-right">
        <div className="feed-grid feed-grid-6">
        
          <div className="feed-card">
            <h3>Start Chatting 💬</h3>
            <p>Connect instantly with users and start real-time conversations.</p>
          </div>

          <div className="feed-card">
            <h3>Unread Messages 🔵</h3>
            <p>Blue dot shows unread messages so you never miss a chat.</p>
          </div>

          <div className="feed-card">
            <h3>Online Status 🟢</h3>
            <p>See who is online and available to chat in real time.</p>
          </div>

          <div className="feed-card">
            <h3>Last Seen ⏱️</h3>
            <p>Know when a user was last active if they’re offline.</p>
          </div>

          <div className="feed-card">
            <h3>Reply to Messages ↩️</h3>
            <p>Reply to specific messages for clearer conversations.</p>
          </div>

          <div className="feed-card">
            <h3>Secure Account 🔐</h3>
            <p>Your account stays secure with login and session handling.</p>
          </div>

        </div>
      </div>  


    </div>
  );
}

export default Home;
