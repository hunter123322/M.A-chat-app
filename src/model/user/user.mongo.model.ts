import Message from "../messages.model";
import { IMessageDocument } from "../messages.model"

export async function initMessage(user_id: number): Promise<IMessageDocument[]> {
    try {
        const message = Message.find({
            $or: [{ senderID: user_id }, { receiverID: user_id }]
        }).sort({ createdAt: -1 }).limit(40);

        return message
    } catch (error) {
        throw new Error("Fail to initialize the message!");
    }
}
