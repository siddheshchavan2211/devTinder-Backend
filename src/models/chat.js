const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");
const { Schema } = moongoose;

const MessagesSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const ChatSchema = new Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [MessagesSchema],
});

const Chat = moongoose.model("Chat", ChatSchema);

module.exports = Chat;
