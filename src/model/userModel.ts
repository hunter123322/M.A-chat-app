import Message from "./messagesModel";

export class UserModel {

    public async initMessage(user_id: number | undefined) {
        try {
            const sendedMessage = await Message.find({ senderID: user_id })
                .sort({ createdAt: -1 })
                .limit(20);

            const receiveMessage = await Message.find({ receiverID: user_id })
                .sort({ createdAt: -1 })
                .limit(20);

            const message= sendedMessage.concat(receiveMessage);
            message.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return message
        } catch (error) {

        }
    }
}
