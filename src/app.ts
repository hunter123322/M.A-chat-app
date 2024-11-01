import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import mongoose from "mongoose";
import messageSchema from "./model/message.js";
import mongoDBconnection from "./controller/mongodbConnection.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messageModel = mongoose.model("message", messageSchema);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

app.use(express.static("public"));

app.get("/socket/v1", async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  } catch (error) {
    res.status(500);
    console.log(error);
  }
});

app.get("/socket/v2", async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

io.on("connection", async (socket: any) => {
  await mongoDBconnection();
  console.log(`a user connected ${socket}`);

  socket.on("chatMessage", async (msg: string) => {
    const messageObj = { content: msg };
    const saveMessage = new messageModel(messageObj);
    await saveMessage.save();

    socket.broadcast.emit("chatMessages", msg);
  });
  socket.on("disconnet", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log("server is runing");
});
