const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
require("./utils/cronJob");

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
const paymentRouter = require("./routes/payment");
const serverinit = require("./utils/socket");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionrequestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

const server = http.createServer(app);

serverinit(server);
connectDB()
  .then(() => {
    console.log("connected");
    server.listen(process.env.PORT_NO, () => {
      console.log("server start");
    });
  })
  .catch((err) => {
    console.log("not connected" + err.message);
  });
