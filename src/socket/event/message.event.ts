import { Server, Socket } from "socket.io";
import { getMessage, postMessage } from "../../service/message/message.socket.service";
import type { MessageDataType } from "../../types/message.type";
import Message, { IMessage } from "../../model/messages.model";

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
            msg.reactions,
            msg.conversationID
        );
        io.to(msg.conversationID).emit("recieveMessage", saveMessage);
    });
}

export function editMessage(socket: Socket, io: Server) {
    socket.on("editMessage", async (data: EditMessage) => {
        const updateMessage = await Message.findOneAndUpdate<IMessage>(
            { _id: data.messageId },
            { content: data.editedMessage },
            { new: true }
        );

        if (updateMessage) {
            io.to(updateMessage.conversationID).emit("messageEdited", updateMessage);
        }
    })
}

export function messageReaction(socket: Socket, io: Server) {
    socket.on("messageReaction", async (data) => {
        const reaction = await Message.findOneAndUpdate<IMessage>(
            { _id: data.messageId },
            {
                $set: {
                    "reactions.0.emoji": data.messageReaction,       // Update emoji at index 0
                    "reactions.0.userID": data.userID        // Optional: Update other fields
                }
            }, { new: true }
        );
        if (reaction) {
            io.to(reaction.conversationID).emit("messageReacted", reaction);
            console.log(data)

        }
    });
}