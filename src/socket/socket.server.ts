import { Server } from "socket.io";
import { chatMessageEvent, deleteMessage, editMessage, messageReaction, registerMessageEvents } from "./event/message.event.js";
import { joinConversationEvent } from "./event/room.event.js";
import { initContact } from "./event/contact.event.js";

async function handleSocketConnection(io: Server) {


  io.on("connection", (socket) => {
    const user_id: number = (socket.request as any).session?.user_id;

    console.log(user_id);
    

    if (!user_id) {
      console.log("Missing user ID. Disconnecting...");
      socket.disconnect();
      return;
    }

    socket.join(`user:${user_id}`);
    console.log(`User ${user_id} connected with session ID:`, (socket.request as any).sessionID);
    socket.on("leaveRoom", (conversationID: string) => {
      socket.leave(conversationID);
      console.log(conversationID, socket.rooms);
    });

    registerMessageEvents(socket);
    joinConversationEvent(socket);
    initContact(socket)
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