const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../models/Message");

router.post("/send", async (req, res) => {
  const { senderId, receiverId, message, replyTo } = req.body || {};

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const sender = String(senderId).trim();
  const receiver = String(receiverId).trim();

  // 2️⃣ Validate ObjectIds
  if (!mongoose.Types.ObjectId.isValid(sender)) {
    return res.status(400).json({ message: "Invalid sender id" });
  }

  if (!mongoose.Types.ObjectId.isValid(receiver)) {
    return res.status(400).json({ message: "Invalid receiver id" });
  }

  try {
    // 3️⃣ Create message with optional reply
    const msg = await Message.create({
      senderId: sender,
      receiverId: receiver,
      message,
      replyTo: replyTo || null
    });

    console.log("Message sent:", msg._id);
    res.status(201).json(msg);

  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Send message failed" });
  }
});

// =========================
// GET CHAT HISTORY
// =========================
// DELETE MESSAGE (sender only)
router.delete("/message/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const { senderId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message id" });
  }

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Authorization check
    if (String(message.senderId) !== String(senderId)) {
      return res.status(403).json({ message: "Not allowed to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: "Message deleted successfully" });

  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

router.get("/history/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;

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
