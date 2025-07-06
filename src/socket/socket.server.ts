import mongoose from "mongoose";
import { Server } from "socket.io";
import Message from "../model/messages.model.js"
import { randomUUID } from "crypto";
import type { MessageDataType } from "../types/message.type.js";
import { chatMessageEvent, registerMessageEvents } from "./event/message.event.js";
import { joinConversationEvent } from "./event/room.event.js";

async function handleSocketConnection(io: Server) {

  io.on("connection", (socket) => {

    registerMessageEvents(socket);
    joinConversationEvent(socket);
    chatMessageEvent(socket, io);

    socket.on("disconnect", () => {
      console.log(`User disconnected`);
    });
  });
}


export default handleSocketConnection;
