import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import  axios  from "axios";

import "./otherprofile.css";

function Otherpofile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/users/${userId}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.log("Profile fetch error:", err));
  }, [userId]);

  if(!profile)
  {
    return <p>Loading profile...</p>;
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
          className="home-button"
          onClick={() => navigate("/profile")}
        >
          <span>👤</span> Profile
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="profile-right">
        <div className="profile-card">
          {/* Avatar */}
          <div className="profile-avatar">
            {profile.username.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="profile-info">
            <h2 className="profile-username">{profile.username}</h2> 
            <p className="profile-fullname">{profile.fullName}</p> 
            <p className="profile-bio">
              {profile.bio || "No bio added yet."}
            </p>
          </div>

         
        </div>
      </div>
    </div>
  );
}

export default Otherpofile;
