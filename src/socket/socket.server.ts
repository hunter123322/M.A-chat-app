import { Server } from "socket.io";
import { chatMessageEvent, deleteMessage, editMessage, messageReaction, registerMessageEvents } from "./event/message.event.js";
import { joinConversationEvent } from "./event/room.event.js";
import session from "../middleware/session.js";

async function handleSocketConnection(io: Server) {
  io.use((socket, next) => {
    session(socket.request as any, {} as any, () => next());
  });

  io.on("connection", (socket) => {
    const user_id: number = (socket.request as any).session?.user_id;

    if (!user_id) {
      console.log("Missing user ID. Disconnecting...");
      socket.disconnect();
      return;
    }

    socket.join(`user:${user_id.toString()}`);

    socket.on("leaveRoom", (conversationID: string) => {
      socket.leave(conversationID);
      console.log(conversationID, socket.rooms);
    });

    registerMessageEvents(socket);
    joinConversationEvent(socket);
    chatMessageEvent(socket, io);
    editMessage(socket, io)
    messageReaction(socket, io)
    deleteMessage(socket, io)


    socket.on("disconnect", () => {
      console.log(`User disconnected:`);
    });
  });
}

export default handleSocketConnection;