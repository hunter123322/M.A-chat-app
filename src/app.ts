import express, {Request, Response} from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import mongoose from "mongoose";
import middlewareSession from "./controller/session.js"
import messageSchema from "./model/message.js";
import mongoDBconnection from "./controller/mongodbConnection.js";
import mysqlConnect from "./controller/mySQLConnection.js";

dotenv.config();
await mongoDBconnection();

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messageModel = mongoose.model("message", messageSchema);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));
app.set('trust proxy', 1) 

app.use(middlewareSession)
app.use(express.static("public"));

app.get("/socket/v1", async (req: Request, res: Response) => {
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
  

  let ID: string;

  socket.on("userID", (userID: string) => {
    console.log(`User ${userID} is connected`);
    ID = userID;
  });

  socket.on("chatMessage", async (msg: string) => {
    if (!ID) {
      console.error("User ID not set.");
      return;
    }

    console.log(ID);
    const messageObj = { content: msg, userID: ID };
    const saveMessage = new messageModel(messageObj);

    try {
      await saveMessage.save();
      socket.broadcast.emit("chatMessages", messageObj);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`user ${ID} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log("server is runing");
});
