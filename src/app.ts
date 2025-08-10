import express, {  } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

// Local imports (ESM-aware)
import sessionMiddleware from "./middleware/session.js";
import mongoDBconnection from "./db/mongodb/mongodb.connection.js";
import router from "./routes/router.js";
import handleSocketConnection from "./socket/socket.server.js";
import { setSecurityHeaders } from "./middleware/securityHeaders.js";

// Types

dotenv.config();

await mongoDBconnection();

const PORT = parseInt(process.env.PORT || "3000");
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // your frontend origin
    credentials: true
  }
});

// View engine
app.set("trust proxy", 1);

// Middleware
app.use(setSecurityHeaders);
app.use(express.json());
app.use(sessionMiddleware);
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST']
}));

// app.use(rateLimiter) //Dissable in production phase
app.use(router);

// Initialize Socket.IO
handleSocketConnection(io);

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
