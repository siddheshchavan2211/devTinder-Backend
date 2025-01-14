const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionrequestRouter = require("./routes/connectionrequest");
const userRouter = require("./routes/getUser");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionrequestRouter);
app.use("/", userRouter);
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
