import { Server, Socket } from "socket.io";
import { getMessage, postMessage } from "../../service/message/message.socket.service";
import type { MessageDataType } from "../../types/message.type";
import Message from "../../model/messages.model";

type EditMessage = { messageId: string, editedMessage: string };

export function registerMessageEvents(socket: Socket) {
    socket.on("getMessage", async (latestMessage: MessageDataType, callback?: Function) => {
        try {
            const messages = await getMessage(latestMessage.conversationID, latestMessage.createdAt);
            console.log("Retrieved messages:", messages);

            if (typeof callback === "function") {
                callback({ success: true, messages });
            }
        } catch (error: any) {
            console.error("Error in getMessage:", error);
            if (typeof callback === "function") {
                callback({ success: false, error: "Failed to get messages: " + error.message });
            }
        }
    });
}

export function chatMessageEvent(socket: Socket, io: Server) {
    socket.on("chatMessage", async (msg: MessageDataType) => {
        if (!msg.content || !msg.senderID || !msg.receiverID || !msg.conversationID) {
            console.error("Invalid message format:", msg);
            return;
        }
        const saveMessage: MessageDataType = await postMessage(
            msg.content,
            msg.senderID,
            msg.receiverID,
            msg.conversationID
        );
        io.to(msg.conversationID).emit("recieveMessage", saveMessage);
    });
}

export function editMessage(socket: Socket) {
    socket.on("editMessage", async (data: EditMessage) => {
        const updateMessage = await Message.findOneAndUpdate({ _id: data.messageId }, { content: data.editedMessage });
    })
}