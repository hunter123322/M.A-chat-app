import mongoose from "mongoose";
const { Schema } = mongoose;

const message = new Schema(
    {
        senderID: { type: String, required: true },
        receiverID: { type: String, required: true },
        conversationID: { type: String, required: true },
        content: { type: String, trim: true, required: true },
        react: { type: String, trim: true }
    }, { timestamps: true }
);

const Message = mongoose.model("Messages", message);


export default Message;