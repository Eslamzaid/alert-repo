import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import express from "express";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("⚡  new client:", socket.id);
  socket.on("disconnect", () => console.log("👋  client left:", socket.id));
});

app.get("/", (_, res) => res.send({ status: "ok" }));
app.post("/alert", (req, res) => {
  io.emit("alert", req.body);
  res.sendStatus(202);
});
app.post("/clear", (_, res) => {
  io.emit("clear-alert");
  res.sendStatus(202);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => console.log(`🚀 listening on :${PORT}`));
