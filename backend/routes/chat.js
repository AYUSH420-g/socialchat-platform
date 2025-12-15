const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../models/Message");

router.post("/send", async (req, res) => {
  const { senderId, receiverId, message } = req.body || {};

  // 1️⃣ Check required fields FIRST
  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // 2️⃣ Normalize IDs to strings (VERY IMPORTANT)
  const sender = String(senderId).trim();
  const receiver = String(receiverId).trim();

  // 3️⃣ Validate MongoDB ObjectIds
  if (!mongoose.Types.ObjectId.isValid(sender)) {
    return res.status(400).json({ message: "Invalid sender id" });
  }

  if (!mongoose.Types.ObjectId.isValid(receiver)) {
    return res.status(400).json({ message: "Invalid receiver id" });
  }

  try {
    // 4️⃣ Save message
    const msg = await Message.create({
      senderId: sender,
      receiverId: receiver,
      message
    });

    console.log("Message sent:", msg._id);
    res.status(201).json(msg);

  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Send message failed" });
  }
});

/**
 * =========================
 * GET CHAT HISTORY
 * =========================
 */
router.get("/history/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;

  // Validate params
  if (
    !mongoose.Types.ObjectId.isValid(senderId) ||
    !mongoose.Types.ObjectId.isValid(receiverId)
  ) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const msgs = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });

    res.json(msgs);
  } catch (err) {
    console.error("Load chat error:", err);
    res.status(500).json({ message: "Load chat failed" });
  }
});

module.exports = router;
