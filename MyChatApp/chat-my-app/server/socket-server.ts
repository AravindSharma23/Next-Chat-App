import { Server } from "socket.io";
import http from "http";

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

type UserSocket = {
  userId: string;
  socketId: string;
};

const onlineUsers: UserSocket[] = [];

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("user-online", (userId: string) => {
    const exists = onlineUsers.find((u) => u.userId === userId);

    if (!exists) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }

    io.emit("online-users", onlineUsers);
  });

  socket.on("join-chat", (chatId: string) => {
    socket.join(chatId);
  });

  socket.on("send-message", (message) => {
    io.to(message.chatId).emit("receive-message", message);
  });

  socket.on("typing", ({ chatId, user }) => {
    socket.to(chatId).emit("typing", user);
  });

  socket.on("stop-typing", ({ chatId, user }) => {
    socket.to(chatId).emit("stop-typing", user);
  });

  socket.on("share-location", (location) => {
    io.to(location.chatId).emit("live-location-update", {
      ...location,
      updatedAt: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    const index = onlineUsers.findIndex((u) => u.socketId === socket.id);

    if (index !== -1) {
      onlineUsers.splice(index, 1);
    }

    io.emit("online-users", onlineUsers);

    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Socket server running on port 4000");
});