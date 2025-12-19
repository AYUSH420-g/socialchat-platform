const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    message: {
      type: String,
      required: true
    },

    // 🔵 UNREAD / READ FLAG (IMPORTANT)
    isSeen: {
      type: Boolean,
      default: false
    },

    // 🔁 REPLY INFO (OPTIONAL)
    replyTo: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      },
      message: String,
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Message", messageSchema);
