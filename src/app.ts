import express, {  } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser"

// Local imports (ESM-aware)
import sessionMiddleware from "./middleware/session.js";
import mongoDBconnection from "./db/mongodb/mongodb.connection.js";
import router from "./routes/router.js";
import handleSocketConnection from "./socket/socket.server.js";
import { setSecurityHeaders } from "./middleware/security.headers.js";
import session from "./middleware/session.js";

dotenv.config();

await mongoDBconnection();

const PORT = parseInt(process.env.PORT || "3000");
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    credentials: true
  }
});

app.set("trust proxy", 1);

// Middleware
app.use(cookieParser());
app.use(setSecurityHeaders);
app.use(express.json());
app.use(sessionMiddleware);
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

io.use((socket, next) => {
  session(socket.request as any, {} as any, next as any);
});

app.use(router);

handleSocketConnection(io);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
