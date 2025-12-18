import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* LEFT PANEL */}
      <div className="home-left">
        <h1 className="home">Chat With Us</h1>

        <button
          className="home-button"
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
      </div>

      {/* RIGHT PANEL (EMPTY FOR NOW) */}
      <div className="home-right">
        {/* Future content goes here */}
      </div>
    </div>
  );
}

export default Home;
