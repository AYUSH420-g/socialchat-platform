const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  const { fullName, username, email, password } = req.body;

  try {
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already in use" });

    const usernameExists = await User.findOne({ username });
    if (usernameExists) return res.status(400).json({ message: "Username already taken" });

    // HASH PASSWORD
    const hashed = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = new User({
      fullName,
      username,
      email,
      password: hashed
    });

    await user.save();

    return res.status(201).json({ message: "User created successfully" });

  } catch (err) {
    console.log("Signup Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    // CREATE TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.log("Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
