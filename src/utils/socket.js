const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const user = require("../models/user");

const SecretRoomId = (fromUsermMsg, toUserMsg) => {
  return crypto
    .createHash("sha256")
    .update([fromUsermMsg, toUserMsg].sort().join("+"))
    .digest("hex");
};

const serverinit = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinchat", async ({ fromUsermMsg, toUserMsg }) => {
      const roomId = SecretRoomId(fromUsermMsg, toUserMsg);
      console.log("Joined room:", roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendmessage",
      async ({ firstName, lastName, fromUsermMsg, toUserMsg, text }) => {
        try {
          const roomId = SecretRoomId(fromUsermMsg, toUserMsg);
          let chat = await Chat.findOne({
            participants: { $all: [fromUsermMsg, toUserMsg] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [fromUsermMsg, toUserMsg],
              messages: [],
            });
          }

          // Save the message to the chat
          chat.messages.push({ senderId: fromUsermMsg, text });
          await chat.save();

          // Emit the message along with the photo URL to the other user
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
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
