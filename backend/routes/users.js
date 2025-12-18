const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET ALL USERS (except current user)
router.get("/", async (req, res) => {
  const { exclude } = req.query;

  try {
    const users = await User.find(
      { _id: { $ne: exclude } },
      "_id username fullName"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users" });
  }
});
// SEARCH USERS BY USERNAME
router.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q) return res.json([]);

  try {
    const users = await User.find(
      {
        username: { $regex: q, $options: "i" }
      },
      "_id username"
    ).limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
});

router.put("/update-profile", async (req, res) => {
  const { userId, fullName, bio } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, bio },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
