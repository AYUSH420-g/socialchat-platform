import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Edit.css";

function Edit() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);

    try {
      const res = await axios.put("/api/users/update-profile", {
        userId: user.id || user._id,
        fullName,
        bio
      });

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/profile");
    } catch (err) {
      console.log("Update error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>

      <label>Full Name</label>
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <label>Bio</label>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Write something about yourself..."
      />

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
      <button onClick={() => navigate("/profile")}>
        cancel
      </button>
    </div>
  );
}

export default Edit;
