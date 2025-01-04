const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const encryptpass = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptpass,
    });
    await user.save();
    res.send("user saved");
  } catch (err) {
    res.status(400).send("not send" + err.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser) {
      throw new Error("Invalid credentials");
    }
    const decryptpass = await bcrypt.compare(password, findUser.password);
    if (decryptpass) {
      const token = await jwt.sign({ _id: findUser.id }, "Morya@22112001");
      res.cookie("token", token);
      res.send("login success");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
app.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      throw new Error("Invalid credentials");
    }
    const decode = await jwt.verify(token, "Morya@22112001");
    const userInfo = await User.findById(decode._id);
    res.send(userInfo);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
app.get("/userDetails", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
    console.log(users);
  } catch (err) {
    res.status(400).send("not send" + err.message);
  }
});
connectDB()
  .then(() => {
    console.log("connected");
    app.listen(1000, () => {
      console.log("server start");
    });
  })
  .catch((err) => {
    console.log("not connected" + err.message);
  });
