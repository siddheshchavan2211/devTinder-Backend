const express = require("express");
const profileRouter = express.Router();
const { UserAuthorization } = require("../middleware/Authorization");
const bcrypt = require("bcrypt");

const {
  updateProfileValidation,
  passwordChangedValidation,
} = require("../utils/validation");
const user = require("../models/user");
profileRouter.get("/profile", UserAuthorization, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//edit profile do validations first then take fields from user check are proper then update
profileRouter.patch("/editProfile", UserAuthorization, async (req, res) => {
  try {
    if (!updateProfileValidation(req)) {
      throw new Error("Invalid Data");
    }
    const loggedInUser = req.user;
    //checking the input data from user and updating the user as per key in db
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} Your Profile Updated Successfully`,
      userdata: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
profileRouter.patch("/editPassword", UserAuthorization, async (req, res) => {
  try {
    !passwordChangedValidation(req);
    const loggedInUser = req.user;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password with 10 salt rounds
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.send("Password Changed Successfully");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = profileRouter;
