const express = require("express");
const { UserAuthorization } = require("../middleware/Authorization");
const chatRouter = express.Router();
const Chat = require("../models/chat");
chatRouter.get("/chat/:touser", UserAuthorization, async (req, res) => {
  const toUser = req.params.touser;
  const fromUser = req.user._id;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [fromUser, toUser] },
    }).populate({ path: "messages.senderId", select: "firstName lastName" });
    console.log("2" + chat);
    if (!chat) {
      chat = new Chat({
        participants: [fromUser, toUser],
        messages: [],
      });
      console.log("1");
      await chat.save();
    }
    res.json(chat);
    console.log(chat, "3");
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = chatRouter;
