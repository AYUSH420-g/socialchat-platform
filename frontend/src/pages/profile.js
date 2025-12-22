import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";

function Profile() {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!localUser) return;

    async function fetchUser() {
      try {
        const res = await axios.get(
          `/api/users/by-username/${localUser.username}`
        );
        setUser(res.data);
      } catch (err) {
        console.log("Profile fetch error:", err);
      }
    }

    fetchUser();
  }, [localUser]);

  if (!localUser) {
    return <p style={{ color: "#fff" }}>Please login</p>;
  }

  if (!user) {
    return <p style={{ color: "#fff" }}>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      
      <div className="home-left">
        <h1 className="home">Chat With Us</h1>

        <button className="home-button" onClick={() => navigate("/home")}>
          🏠 Home
        </button>

        <button className="home-button" onClick={() => navigate("/chat/:receiverId")}>
          💬 Messages
        </button>

        <button className="home-button-dis">
          👤 Profile
        </button>

        <button
          className="home-logout"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      
      <div className="profile-right">
        <div className="profile-card">
          {/* Avatar */}
          <div className="profile-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>

          
          <div className="profile-info">
            <h2 className="profile-username">{user.username}</h2>
            <p className="profile-fullname">{user.fullName}</p>
            <p className="profile-bio">
              {user.bio || "No bio added yet."}
            </p>
          </div>

          
          <div className="profile-actions">
            <button
              className="edit-btn"
              onClick={() => navigate("/edit")}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
