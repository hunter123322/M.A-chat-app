import express, {  } from "express";
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

// Types

dotenv.config();

await mongoDBconnection();

const PORT = parseInt(process.env.PORT || "3000");
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Shim __dirname in ESM (Bun supports this, too)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
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
app.use(express.static(path.resolve(__dirname, "../public")));

// Initialize Socket.IO
handleSocketConnection(io);

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
