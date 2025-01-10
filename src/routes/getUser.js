const express = require("express");
const userRouter = express.Router();
const { UserAuthorization } = require("../middleware/Authorization");
const ConnReqModel = require("../models/connRequest");
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
module.exports = userRouter;
//get request from db where status is Intersted but onl get specific details
//use joins
