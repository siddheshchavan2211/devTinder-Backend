const express = require("express");
const { UserAuthorization } = require("../middleware/Authorization");
const ConnReqModel = require("../models/connRequest");
const connectionrequestRouter = express.Router();
const User = require("../models/user");

connectionrequestRouter.post(
  "/request/send/:status/:userID",
  UserAuthorization,
  async (req, res) => {
    try {
      const senderId = req.user._id;
      const recieverId = req.params.userID;
      const status = req.params.status;
      const connRequest = new ConnReqModel({
        senderId,
        recieverId,
        status,
      });
      const touser = await User.findById(req.params.userID);
      const id = req.params.userID;
      if (status !== "Intersted" && status !== "Ignored") {
        throw new Error("Invalid Status");
      }
      if (!touser) {
        throw new Error(400).send("Invalid User");
      }
      if (touser.id === id) {
        throw new Error("user cannot send request to himself");
      }
      const connectionReq = await ConnReqModel.findOne({
        $or: [
          { senderId, recieverId },
          {
            senderId: recieverId,
            recieverId: senderId,
          },
        ],
      });
      if (connectionReq) {
        throw new Error("Request already sent");
      }
      const data = await connRequest.save();
      res.send({
        message: `${req.user.firstName + " "} Request sent successfully`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

module.exports = connectionrequestRouter;
