// Server File
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const app = express();
const logger = require("./config/logger");
const { formatMessage } = require("./utils/messages");
const {
  getCurrentUser,
  joinUser,
  userLeaves,
  getRoomUsers,
} = require("./utils/users");
const server = http.createServer(app);
const io = socketio(server);

// middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// app chatbot
const chatBot = "Chat-bot";

// listen to a connection
io.on("connection", (socket) => {
  // join user to a room
  socket.on("joinRoom", ({ username, room }) => {
    // creating the user
    const user = joinUser(socket.id, username, room);

    // using the socket room method
    socket.join(user.room);

    // when a user joins
    socket.emit(
      "message",
      formatMessage(chatBot, `welcome to david's chat-app`)
    );

    // broad cast to other users except the new user
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(chatBot, ` ${user.username} joined the room`)
      );

    // get room users
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // get message from chat-Form
  socket.on("chatMessage", (msg) => {
    // getting the current user
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(`${user.username}`, msg));
  });

  // when a user disconnects
  socket.on("disconnect", () => {
    const user = userLeaves(socket.id);

    // if the user exists
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(chatBot, `${user.username} left the chat`)
      );
    }

    // get room users
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
});

// listen to a server
const port = process.env.PORT || 4000;
server.listen(port, () => logger.info(`server listening on port ${port}`));
