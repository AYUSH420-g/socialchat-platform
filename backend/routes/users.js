const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User");
const Message = require("../models/Message");

/**
 * ===============================
 * GET ALL USERS (except current user)
 * ===============================
 */
router.get("/", async (req, res) => {
  const { exclude } = req.query;

  if (!exclude || !mongoose.Types.ObjectId.isValid(exclude)) {
    return res.status(400).json({ message: "Invalid exclude id" });
  }

  try {
    const users = await User.find(
      { _id: { $ne: exclude } },
      "_id username fullName isOnline lastSeen"
    );

    res.json(users);
  } catch (err) {
    console.error("Load users error:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
});

/**
 * ===============================
 * SEARCH USERS BY USERNAME
 * ===============================
 */
router.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q) return res.json([]);

  try {
    const users = await User.find(
      { username: { $regex: q, $options: "i" } },
      "_id username"
    ).limit(10);

    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

router.post("/logout", async (req, res) => {
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  await User.findByIdAndUpdate(userId, {
    isOnline: false,
    lastSeen: new Date()
  });

  res.json({ message: "Logged out" });
});


router.post("/heartbeat", async (req, res) => {
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  await User.findByIdAndUpdate(userId, {
    isOnline: true,
    lastSeen: new Date()
  });

  res.json({ success: true });
});

router.get("/status/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId)
    .select("isOnline lastSeen");

  res.json(user);
});


/**
 * ===============================
 * UPDATE PROFILE
 * ===============================
 */
router.put("/update-profile", async (req, res) => {
  const { userId, fullName, bio } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
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


router.get("/unread", async (req, res) => {
  const { userId } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const unread = await Message.aggregate([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(userId),
          isSeen: false
        }
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(unread);
  } catch (err) {
    console.error("Unread fetch error:", err);
    res.status(500).json({ message: "Unread fetch failed" });
  }
});

module.exports = router;
