import { Server } from "socket.io";
import { chatMessageEvent, registerMessageEvents } from "./event/message.event.js";
import { joinConversationEvent } from "./event/room.event.js";
import session from "../middleware/session.js";

async function handleSocketConnection(io: Server) {
  // Wrap the session middleware for Socket.IO
  io.use((socket, next) => {
    session(socket.request as any, {} as any, () => next());
  });



  io.on("connection", (socket) => {
    const user_id = (socket.request as any).session?.user_id;

    if (!user_id) {
      console.log("Missing user ID. Disconnecting...");
      socket.disconnect();
      return;
    }

    // Register event handlers
    registerMessageEvents(socket);
    joinConversationEvent(socket);
    chatMessageEvent(socket, io);

    





    socket.on("disconnect", () => {
      console.log(`User disconnected: ${user_id}`);
    });
  });
}

export default handleSocketConnection;