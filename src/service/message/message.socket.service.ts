import Message from "../../model/messages.model";
import { randomUUID } from "crypto";
import { MessageDataType, IReaction } from "../../types/message.type";

export async function getMessage(convoID: String, lastTimestamp: any): Promise<any[]> {
    try {
        const query = {
            conversationalID: convoID,
            createdAt: { $lt: lastTimestamp }
        };

        const messages = await Message.find(query)
            .sort({ createdAt: 1 })
            .limit(50);

        if (!messages || messages.length === 0) {
            throw new Error("No messages found");
        }

        return messages;
    } catch (error: any) {
        console.error("Database error:", error);
        throw new Error("Failed to retrieve messages: " + error.message);
    }
}

export async function postMessage(
    content: String,
    sender: String,
    reciever: String,
    reactions: Array<IReaction>,
    conversationId?: String
): Promise<MessageDataType> {
    try {
        if (!conversationId) {
            const lastconversationID = randomUUID();
            conversationId = lastconversationID.toString();
        }

        const newMessage = new Message({
            senderID: sender,
            receiverID: reciever,
            conversationID: conversationId,
            reactions: reactions,
            content: content
        });

        const saveMessage: MessageDataType = await newMessage.save();
        if (!saveMessage) throw new Error("Failed to send!");
        return saveMessage;
    } catch (error: any) {
        throw new Error("Post message Error!");
    }
}
