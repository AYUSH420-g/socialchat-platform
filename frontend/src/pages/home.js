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
          <span>💬</span> Chat
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

      {/* RIGHT PANEL (EMPTY FOR NOW) */}
      <div className="home-right">welcome to feed.
        {/* Future content goes here */}
      </div>
    </div>
  );
}

export default Home;
