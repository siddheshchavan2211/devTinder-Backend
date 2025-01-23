const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

//Signup API
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const encryptpass = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptpass,
    });
    const userdata = await user.save();
    res.json({ message: "Register Successful", data: userdata });
  } catch (err) {
    res.status(400).send("Resister Failed" + err.message);
  }
});
//login API
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      throw new Error("Invalid Credentials");
    }
    const decryptpass = await findUser.validatePassword(password);
    if (decryptpass) {
      const token = await findUser.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.json({ message: "Login Successful ", LoginUser: findUser });
    } else {
      throw new Error(" Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Login Failed" + " " + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.send("Logout Successful");
});
module.exports = authRouter;
