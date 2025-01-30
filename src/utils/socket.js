const socket = require("socket.io");
const crypto = require("crypto");
const SecretRoomId = (fromUsermMsg, toUserMsg) => {
  return crypto
    .createHash("sha256")
    .update([fromUsermMsg, toUserMsg].sort().join("+"))
    .digest("hex");
};

const serverinit = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinchat", async ({ fromUsermMsg, toUserMsg }) => {
      const roomId = SecretRoomId(fromUsermMsg, toUserMsg);
      console.log(roomId);
      socket.join(roomId);
    });

    socket.on("sendmessage", ({ firstName, fromUsermMsg, toUserMsg, text }) => {
      // const roomId = await bcrypt.hash(fromUsermMsg + toUserMsg, 10).sort();
      const roomId = SecretRoomId(fromUsermMsg, toUserMsg);
      console.log(roomId);
      io.to(roomId).emit("messageReceived", { firstName, text });
    });
    socket.on("disconnect", () => {});
  });
};
module.exports = serverinit;
