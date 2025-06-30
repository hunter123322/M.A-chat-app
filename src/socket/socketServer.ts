import mongoose from "mongoose";
import { Server } from "socket.io";
import Message from "../model/messagesModel.js"
import { randomUUID } from "crypto";

interface messageDataType {
  senderID: string,
  receiverID: string,
  conversationID: string,
  content: string,
  createdAt?: Date
}

async function handleSocketConnection(io: Server) {

  io.on("connection", (socket) => {

    socket.on("getMessage", async (latestMessage: messageDataType, callback?: Function) => {
      try {
        const messages = await getMessage(latestMessage.conversationID, latestMessage.createdAt);
        console.log("Retrieved messages:", messages);

        if (callback && typeof callback === "function") {
          callback({ success: true, messages });  // Changed from 'message' to 'messages' (plural)
        }
      } catch (error: any) {
        console.error("Error in getMessage:", error);
        if (callback && typeof callback === "function") {
          callback({
            success: false,
            error: "Failed to get messages: " + error.message
          });
        }
      }
    });
    // chatMessage
    socket.on("joinConversation", (conversationID: string) => {
      // Join the specified conversation room
      socket.join(conversationID);
      console.log(`User ${socket.id} joined conversation ${conversationID}`);
    });

    socket.on("chatMessage", async (msg: messageDataType) => {
      // Validate the message structure
      if (!msg.content || !msg.senderID || !msg.receiverID || !msg.conversationID) {
        console.error("Invalid message format:", msg);
        return;
      }

      console.log("Received message:", msg);
/**
 * 
 *
 // Event Listeners
sendButton.addEventListener("click", sendMessage);
inputMessage.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
 * 
 * */ 
      // Save to MongoDB (uncomment when ready)
    await postMessage(
        msg.content,
        msg.senderID,
        msg.receiverID,
        msg.conversationID
      );

      // Send only to participants in this conversation
      io.to(msg.conversationID).emit("chatMessage", {
        ...msg,
        createdAt: new Date() // Add server-side timestamp
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected`);
    });
  });
}

// handle the get message
async function getMessage(convoID: String, lastTimestamp: any): Promise<any[]> {
  try {
    const query = {
      conversationalID: convoID,
      createdAt: { $lt: lastTimestamp }
    };

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })  // Newest first
      .limit(50);                // Limit results to prevent overload

    if (!messages || messages.length === 0) {
      throw new Error("No messages found");
    }

    return messages;
  } catch (error: any) {
    console.error("Database error:", error);
    throw new Error("Failed to retrieve messages: " + error.message);
  }
}

async function postMessage(content: String, sender: String, reciever: String, conversationId?: String): Promise<void> {
  try {
    if (!conversationId) {
      const lastconversationID = randomUUID();
      conversationId = lastconversationID.toString();
    }

    const newMessage = new Message({
      senderID: sender,
      receiverID: reciever,
      conversationID: conversationId,
      content: content
    });

    const saveMessage = await newMessage.save();
    if (!saveMessage) throw new Error("Failed to send!");

  } catch (error: any) {
    throw new Error("Post message Error!" + error.message);
  }
}


export default handleSocketConnection;
