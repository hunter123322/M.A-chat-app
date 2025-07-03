import mongoose from "mongoose";
const { Schema } = mongoose;

const message = new Schema(
    {
        senderID: { type: String, required: true },
        receiverID: { type: String, required: true },
        conversationID: { type: String, required: true },
        content: { type: String, required: true },
        contentType: {
            type: String,
            enum: ['text', 'image', 'video', 'file', 'audio'],
            default: 'text'
        },
        react: [{
            userID: { type: String, required: true },
            emoji: { type: String }
        }],
        status: {
            type: String,
            enum: ['sent', 'sending', 'delivered', 'seen', 'invalid'],
            default: 'sent'
        },
    }, { timestamps: true }
);

const groupMessage = new Schema({
    senderID: { type: String, required: true },
    conversationID: { type: String, required: true },
    content: {
        type: String,
        enum: ['text', 'image', 'video', 'file', 'audio'],
        default: 'text'
    },
    react: [{
        userID: { type: String, required: true },
        emoji: { type: String }
    }],
    status: {
        type: String,
        enum: ['sent', 'sending', 'delivered', 'seen', 'invalid'],
        default: 'sending'
    },
}, { timestamps: true })
const Message = mongoose.model("Messages", message);


export default Message;