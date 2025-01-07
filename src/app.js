const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionrequestRouter = require("./routes/connectionrequest");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionrequestRouter);
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
