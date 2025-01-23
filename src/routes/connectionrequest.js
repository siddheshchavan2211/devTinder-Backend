const express = require("express");
const { UserAuthorization } = require("../middleware/Authorization");
const ConnReqModel = require("../models/connRequest");
const connectionrequestRouter = express.Router();
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
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
      if (touser.id.toString() === senderId.toString()) {
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

      const emailsend = await sendEmail.run(
        `New Friend Request from ${req.user.firstName}`,
        `${req.user.firstName + " "} Request sent successfully to  ${
          touser.firstName
        }`
      );
      console.log(emailsend);
      res.send({
        message: `${req.user.firstName + " "} Request sent successfully to ${
          touser.firstName
        }`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

connectionrequestRouter.post(
  "/request/review/:status/:userID",
  UserAuthorization,
  async (req, res) => {
    //validate the status
    //sid to ms
    //req only from sid to ms means sending to that person should accept
    //sender status should only interested
    //validate the user id
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const userId = req.params.userID;
      if (status !== "Accepted" && status !== "Rejected") {
        throw new Error("Invalid Status");
      }

      const connRequest = await ConnReqModel.findOne({
        _id: userId,
        recieverId: loggedInUser._id,
        status: "Intersted",
      });
      console.log(connRequest);
      if (!connRequest) {
        throw new Error("No Request Found");
      }
      connRequest.status = status;
      const updateddata = await connRequest.save();
      res.json({ message: "Connection Request " + status, updateddata });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);
module.exports = connectionrequestRouter;
