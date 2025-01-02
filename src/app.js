const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
app.use(express.json());
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user saved");
  } catch (err) {
    res.status(400).send("not send", err);
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
    console.log("not connected");
  });
