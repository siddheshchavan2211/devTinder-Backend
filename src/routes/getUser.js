const express = require("express");
const userRouter = express.Router();
const { UserAuthorization } = require("../middleware/Authorization");
const ConnReqModel = require("../models/connRequest");
const User = require("../models/user");
//getting all pending request from user
userRouter.get(
  "/user/requests/received",
  UserAuthorization,
  async (req, res) => {
    try {
      const user = req.user;
      const pendingRequests = await ConnReqModel.find({
        senderId: user._id,
        status: "Intersted",
      }).populate(
        "senderId",
        "firstName lastName photoUrl skills about age gender mobile"
      );
      res.send({ message: "Data Fetched Successfully", data: pendingRequests });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

userRouter.get("/user/friends", UserAuthorization, async (req, res) => {
  try {
    const user = req.user;
    const friends = await ConnReqModel.find({
      $or: [
        { senderId: user._id, status: "Accepted" },
        { recieverId: user._id, status: "Accepted" },
      ],
    })
      .populate(
        "senderId",
        "firstName lastName photoUrl skills about age gender mobile"
      )
      .populate(
        "recieverId",
        "firstName lastName photoUrl skills about age gender mobile"
      );
    //for same user returning opponet as a friend
    const data = friends.map((friend) => {
      if (friend.senderId._id.toString() === user._id.toString()) {
        return friend.recieverId;
      }
      return friend.senderId;
    });
    res.json({ message: "friends", data: data });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

userRouter.get("/feed", UserAuthorization, async (req, res) => {
  try {
    const user = req.user;
    //get all friends except current user and friends and rejected requests
    //first finding all connection request which i sent or recived then select only senderid and recieverid
    const friends = await ConnReqModel.find({
      $or: [{ senderId: user._id }, { recieverId: user._id }],
    }).select("senderId recieverId");
    //hiding the user which are friend and self
    const hideUsers = new Set();
    friends.forEach((friend) => {
      hideUsers.add(friend.senderId.toString());
      hideUsers.add(friend.recieverId.toString());
    });
    //using $nin(notin) to pass this users and print rest values
    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        {
          _id: { $ne: user._id },
        },
      ],
    }).select("firstName lastName photoUrl skills about age gender mobile");
    res.json({ message: "feed", data: feedUsers });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});
module.exports = userRouter;
//get request from db where status is Intersted but onl get specific details
//use joins
