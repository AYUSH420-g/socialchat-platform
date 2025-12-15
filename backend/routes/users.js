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

module.exports = router;
