import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import cors from "cors";

// Local imports (ESM-aware)
import middlewareSession from "./middleware/session.js";
import mongoDBconnection from "./db/mongodb/mongodb.connection.js";
import router from "./routes/router.js";
import handleSocketConnection from "./socket/socket.server.js";
import { setSecurityHeaders } from "./middleware/securityHeaders.js";
import Message from "./model/messages.model.js";
import isAuthenticated from "./middleware/authentication.js";

dotenv.config();

// Bun supports top-level await ✔
await mongoDBconnection();

const PORT = parseInt(process.env.PORT || "3000");
const app = express();
const server = createServer(app);
const io = new Server(server);

// Shim __dirname in ESM (Bun supports this, too)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.set("trust proxy", 1);

// Middleware
app.use(setSecurityHeaders);
app.use(cors());
app.use(express.json());
app.use(middlewareSession);
app.use(express.static(path.resolve(__dirname, "../public")));
app.use(router);

// Routes
app.get("/socket/v1", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const id = (req.session as { user_id?: number }).user_id;
    const dataToBeRender: any[] = [];

    const sendedMessage = await Message.find({ senderID: id })
      .sort({ createdAt: -1 })
      .limit(10);

    const receiveMessage = await Message.find({ receiverID: id })
      .sort({ createdAt: -1 })
      .limit(10);

    dataToBeRender.push(sendedMessage);
    dataToBeRender.push(receiveMessage);

    const data: any = {
      title: "person1",
      fullName: "Unknown User",
      status: "Unknown",
      contactList: [
        { id: "14", name: "Alice", img: "person1.webp" },
        { id: "3", name: "new", img: "person2.webp" },
        { id: "1", name: "Charlie", img: "person1.webp" }
      ]
    };

    res.render("messageList", data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

async function contactList(userID?: number): Promise<Object[]> {
  try {
    const result: Object[] = await Message.aggregate([
      {
        $group: {
          _id: "$conversationID",
          receiverID: { $first: "$receiverID" }
        }
      }
    ]);
    return result;
  } catch (error) {
    throw new Error("Failed to fetch contact List!");
  }
}

// Initialize Socket.IO
handleSocketConnection(io);

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
