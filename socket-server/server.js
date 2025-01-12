const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = 7000;

const users = {};

io.on("connection", (socket) => {
  console.log("Alguien se conecto, y su ID es: " + socket.id);

  socket.on("Se desconecto ", () => {
    console.log(`${socket.id} disconnected`);

    for (let user in users) {
      if (users[user] === socket.id) {
        delete users[user];
      }
    }

    io.emit("all_users", users);
  });

  socket.on("new_user", (username) => {
    console.log("Server : " + username);
    users[username] = socket.id;

//podemos decirle a todos los demás usuarios que alguien se conectó    io.emit("all_users", users);
    io.emit("all_users", users);
  });

  socket.on("send_message", (data) => {
    console.log(data);

    const socketId = users[data.receiver];
    io.to(socketId).emit("new_message", data);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
