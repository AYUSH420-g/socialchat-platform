import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home">Chat With Us</h1>

      <button className="home-button"
      onClick={() => navigate("/chat/:receiverId")}>
        Chat
      </button>
    </div>
  );
}

export default Home;
