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

    replyTo: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      },
      message: {
        type: String
      },
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
