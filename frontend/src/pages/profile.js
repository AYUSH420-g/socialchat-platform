import { useNavigate } from "react-router-dom";
import "./profile.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  if (!user) {
    return <p style={{ color: "#fff" }}>Please login</p>;
  }

  return (
    <div className="profile-container">
      {/* LEFT PANEL */}
      <div className="profile-left">
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
          className="home-button-dis"
        //   onClick={() => navigate("/profile")}
        >
          <span>👤</span> Profile
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="profile-right">
        <div className="profile-card">
          {/* Avatar */}
          <div className="profile-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="profile-info">
            <h2 className="profile-username">{user.username}</h2>
            <p className="profile-fullname">{user.fullName}</p>
            <p className="profile-bio">
              {user.bio || "No bio added yet."}
            </p>
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <button className="edit-btn"
                onClick={()=>{
                    navigate("/Edit");
                }}
            >Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
