const express = require("express");
const app = express();
const database = require("./config/db.js");
const http = require("http");
const cors = require("cors");
require('dotenv').config();

const PORT=process.env.PORT || 5000
const { Server } = require("socket.io");

const cloudinary = require("cloudinary").v2;

database();
app.use(cors());
app.use(express.json());


const server = http.createServer(app);

(async function () {
  cloudinary.config({
    cloud_name: "deo4larpc",
    api_key: "282467973281694",
    api_secret: "yjlWYpnTh7a8V4a6pmwDkz5FSjU",
    secure: true,
  });
})();


const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

const chatController = require("./conrtollers/chatController.js");
const UserRoutes = require("./routes/UserRoutes.js");
const Room = require("./models/Room.js");

app.use("/api/user/", UserRoutes); 
let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("joinRoom", async (chatRoomId) => {
    socket.join(chatRoomId);
    const messages = await chatController.getChatMessages(chatRoomId);
    socket.emit("chatHistory", messages);
  });

  
  socket.on("new-user-add", (newUserId) => {
    if (!onlineUsers.some((user) => user.userId === newUserId)) {
      onlineUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("new user is here!", onlineUsers);
      
      io.emit("user-online", newUserId); 
    }
    io.emit("get-users", onlineUsers);
  });

  
  socket.on("newMessage", async ({ chatRoomId, message }) => {
    const updatedMessages = await chatController.saveMessage(chatRoomId, message);
    io.to(chatRoomId).emit("message", updatedMessages); // Broadcast to room

    await Room.updateMany(
      { roomId: chatRoomId }, 
      {
        $set: {
          "MetaData.$[elem].lastMessage": message?.content,
          "MetaData.$[elem].lastMessageTime": message?.timestamp, 
        },
      },
      {
        arrayFilters: [{ "elem.userId": { $exists: true } }], 
        new: true, 
      }
    );
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    const user = onlineUsers.find((user) => user.socketId === socket.id);
    if (user) {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log("user disconnected", onlineUsers);
      io.emit("user-offline", user.userId); 
    }
    io.emit("get-users", onlineUsers);
  });

  
  socket.on("offline", () => {
    const user = onlineUsers.find((user) => user.socketId === socket.id);
    if (user) {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log("user is offline", onlineUsers);
      io.emit("user-offline", user.userId); 
    }
    io.emit("get-users", onlineUsers);
  });
});


server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
