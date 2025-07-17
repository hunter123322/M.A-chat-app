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

type ReactionData = {
    messageReaction: string,
    userID: string,
    messageID: string,
}

export function messageReaction(socket: Socket, io: Server) {
    socket.on("messageReaction", async (data: ReactionData) => {
        const { messageID, userID, messageReaction } = data;

        const updated = await Message.findOneAndUpdate<IMessage>(
            {
                _id: messageID,
                "reactions.userID": userID
            },
            {
                $set: {
                    "reactions.$.emoji": messageReaction
                }
            },
            { new: true }
        );
        console.log(updated);


        let finalMessage = updated;
        if (!updated) {
            finalMessage = await Message.findOneAndUpdate<IMessage>(
                { _id: messageID },
                {
                    $push: {
                        reactions: { userID, emoji: messageReaction }
                    }
                },
                { new: true }
            );
        }
        console.log(finalMessage);


        // Emit to room if updated
        if (finalMessage) {
            io.to(finalMessage.conversationID).emit("messageReacted", finalMessage);
        }
    });
}

type DeleteMessage = {
    messageId: string,
}

export function deleteMessage(socket: Socket, io: Server) {
    socket.on("deleteMessage", async (message: DeleteMessage) => {
        if (!message) throw new Error("Empty message to be deleted!");

        const existingMessage = await Message.findById({_id: message.messageId});
        const conversationID = existingMessage?.conversationID;
        console.log(conversationID);
        
        if (!existingMessage) throw new Error("Message not found!");

        await existingMessage.deleteOne();

        io.to(conversationID as string).emit("deleteMessage", message.messageId);
    });
}
