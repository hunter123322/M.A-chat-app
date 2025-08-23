import mongoose, { Schema, Document, Model } from "mongoose";
import { IReaction } from "../types/message.type";
import type { IMessage } from "../types/message.type";


export interface IMessageDocument extends IMessage, Document { }

const reactionSchema = new Schema<IReaction>({
  userID: { type: String, required: true },
  emoji: { type: String }
}, { _id: false });

const messageSchema = new Schema<IMessageDocument>(
  {
    senderID: { type: String, required: true },
    receiverID: { type: String, required: true },
    conversationID: { type: String, required: true, index: true },
    content: { type: String, required: true },
    contentType: {
      type: String,
      enum: ["text", "image", "video", "file", "audio"],
      default: "text",
    },
    reactions: [{
      userID: { type: String, required: true },
      emoji: { type: String },
    }],
    status: {
      type: String,
      enum: ["sent", "sending", "delivered", "seen", "invalid"],
      default: "sent",
    },
    hide: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: "messages"
  }
);

const Message: Model<IMessageDocument> = mongoose.models.Message ||
  mongoose.model<IMessageDocument>("Message", messageSchema);

export default Message;