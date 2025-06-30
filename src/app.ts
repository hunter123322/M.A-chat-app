import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import cors from "cors";
import middlewareSession from "./controller/session.js";
import mongoDBconnection from "./controller/mongodbConnection.js";
import router from "./routes/router.js";
import handleSocketConnection from "./socket/socketServer.js";
import { setSecurityHeaders } from "./middleware/securityHeaders.js";
import Message from "./model/messagesModel.js";
import isAuthenticated from "./controller/authentication.js";

dotenv.config();
await mongoDBconnection();

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const messageModel = mongoose.model("message", messageSchema);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.set("trust proxy", 1);

app.use(setSecurityHeaders)
app.use(cors());
app.use(express.json());
app.use(middlewareSession);
app.use(express.static(path.resolve(__dirname, "../public")));
app.use(router);



app.get("/socket/v1", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const id: any = req.query.user;

    let dataToBeRender: any[] = [];

    const sendedMessage = await Message.find({ senderID: id })
      .sort({ createdAt: -1 })
      .limit(10);

    const receiveMessage = await Message.find({ receiverID: id })
      .sort({ createdAt: -1 })
      .limit(10);

    dataToBeRender.push(sendedMessage);
    dataToBeRender.push(receiveMessage);

    console.log(dataToBeRender, id, await contactList(1));



    const data: any = {
      title: "person1", fullName: "aldrin belardo", status: "active", messageList: dataToBeRender, contactList: [
        { id: "14", name: "Alice", img: "person1.webp" },
        { id: "3", name: "new", img: "person2.webp" },
        { id: "1", name: "Charlie", img: "person1.webp" }
      ]
    }
    res.render("messageList", data)

  } catch (error) {
    res.status(500);
    console.log(error);
  }
});

async function getNameOfContact(contactId: String[]) {
  try {
    let contactData = [];

    contactId.forEach(id => {

    })
  } catch (error: any) {

  }
}

async function contactList(userID?: Number): Promise<Object[]> {
  try {
    const result: Object[] = await Message.aggregate([
      {
        $group: {
          _id: "$conversationID",
          receiverID: { $first: "$receiverID" }// or $last
        }
      }
    ])
    return result;
  } catch (error) {
    throw new Error("Failed to fetch contact List!")
  }
}


handleSocketConnection(io);

server.listen(PORT, () => {
  console.log("server is runing");
});
