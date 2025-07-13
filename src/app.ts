import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import cors from "cors";

// Local imports (ESM-aware)
import sessionMiddleware from "./middleware/session.js";
import mongoDBconnection from "./db/mongodb/mongodb.connection.js";
import router from "./routes/router.js";
import handleSocketConnection from "./socket/socket.server.js";
import { setSecurityHeaders } from "./middleware/securityHeaders.js";
import isAuthenticated from "./middleware/authentication.js";
import { rateLimiter } from "./middleware/rate.limit.js";
import { initUserContact, initUserConversation } from "./model/user/user.mongo.model.js";

// Types
import type { Conversation, Participant } from "./types/conversation.list.type.js";

dotenv.config();

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
app.use(sessionMiddleware);
app.use(rateLimiter)
app.use(router);
app.use(express.static(path.resolve(__dirname, "../public")));

// Routes
interface SessionWithUserId {
  user_id?: number;
}

interface Contact {
  conversationID: string | number;
  // Add other contact properties if needed
}

interface MessageListViewData {
  title: string;
  fullName: string;
  status: string;
  contactList: Array<{
    id: string | number;
    name: string;
    mute?: boolean;
    img?: string;
  }>;
}

// app.get("/socket/v1", isAuthenticated, async (req: Request, res: Response) => {
//   try {
//     // Get user ID with proper typing
//     const session = req.session as SessionWithUserId;
//     const userID = session.user_id;

//     if (!userID) {
//       throw new Error('User ID not found in session');
//     }

//     // Fetch user data
//     const userContact = await initUserContact(userID);
//     if (!userContact) {
//       throw new Error('User contact not found');
//     }

//     const conversations = await initUserConversation(userContact.conversationID);
//     if (!conversations?.length) {
//       throw new Error('No conversations found');
//     }

//     // Process conversations
//     const { contacts, currentUser } = conversations.reduce<{
//       contacts: Participant[];
//       currentUser?: Participant;
//     }>((acc, conversation) => {
//       const [participantA, participantB] = conversation.participant;
      
//       if (participantA.userID == userID) {
//         acc.contacts.push(participantB);
//         acc.currentUser = participantA;
//       } else {
//         acc.contacts.push(participantA);
//         acc.currentUser = participantB;
//       }
      
//       return acc;
//     }, { contacts: [] });

//     if (!currentUser) {
//       throw new Error('Current user data not found in conversations');
//     }

//     // Prepare contact list - dynamic from conversations + static entries
//     const dynamicContacts = contacts.map(contact => ({
//       id: contact.userID,
//       name: contact.nickname || contact.firstName,
//       mute: contact.mute
//     }));

//     const staticContacts = [
//       { id: "3", name: "new", img: "person2.webp" },
//       { id: "1", name: "Charlie", img: "person1.webp" }
//     ];

//     // Prepare view data
//     const viewData: MessageListViewData = {
//       title: "M.A-Chat-App",
//       fullName: `${currentUser.firstName} ${currentUser.lastName}`,
//       status: "Active",
//       contactList: [...dynamicContacts, ...staticContacts]
//     };

//     res.render("messageList", viewData);

//   } catch (error) {
//     console.error('Error in /socket/v1:', error);
//     res.status(500).render('error', { 
//       message: 'Failed to load messages',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// Initialize Socket.IO
handleSocketConnection(io);

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
