// require("dotenv").config();
// const app = require("./src/app");

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

require("./src/sockets/live.socket")(io);

server.listen(PORT, () => {
  console.log(`Server + Socket.IO running at http://localhost:${PORT}`);
});
