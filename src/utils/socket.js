const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const { time } = require("console");
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

    socket.on(
      "sendmessage",
      async ({ firstName, fromUsermMsg, toUserMsg, text }) => {
        // const roomId = await bcrypt.hash(fromUsermMsg + toUserMsg, 10).sort();

        try {
          const roomId = SecretRoomId(fromUsermMsg, toUserMsg);
          console.log(roomId);
          let chat = await Chat.findOne({
            participants: {
              $all: [fromUsermMsg, toUserMsg],
            },
          });
          if (!chat) {
            chat = new Chat({
              participants: [fromUsermMsg, toUserMsg],
              messages: [],
            });
          }
          chat.messages.push({ senderId: fromUsermMsg, text });
          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            text,
            timestamp: new Date().getTime(),
          });
        } catch (err) {
          console.log(err);
        }
        socket.on("disconnect", () => {});
      }
    );
  });
};
module.exports = serverinit;
