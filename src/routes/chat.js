const express = require("express");
const { UserAuthorization } = require("../middleware/Authorization");
const chatRouter = express.Router();
const Chat = require("../models/chat");
const ConnReqModel = require("../models/connRequest");
chatRouter.get("/chat/:touser", UserAuthorization, async (req, res) => {
  const toUser = req.params.touser;
  const fromUser = req.user._id;
  const senderId = req.user._id;
  const recieverId = toUser;

  try {
    // Check if the two users are connected (i.e., friends with "Accepted" status)
    const connectionReq = await ConnReqModel.findOne({
      $or: [
        { senderId, recieverId },
        {
          senderId: recieverId,
          recieverId: senderId,
          status: "Accepted",
        },
      ],
    });

    // If not connected, throw an error
    if (!connectionReq) {
      throw new Error("You cannot chat with this user as you are not friends");
    }

    // Check if a chat already exists between the users
    let chat = await Chat.findOne({
      participants: { $all: [fromUser, toUser] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photoUrl",
    });

    console.log("2", chat); // Logging chat object

    // If no chat exists, create a new one
    if (!chat) {
      chat = new Chat({
        participants: [fromUser, toUser],
        messages: [],
      });
      console.log("1"); // Log creation of new chat
      await chat.save();
    }

    // Send the response with the chat
    res.json(chat);
    console.log("3", chat); // Log chat after saving (or found)
  } catch (err) {
    // Handle any errors that occur
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = chatRouter;
