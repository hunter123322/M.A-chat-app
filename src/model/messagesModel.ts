import mongoose, { Schema, Document, Model } from "mongoose";

// 🔹 Interface for a single reaction
interface IReaction {
  userID: string;
  emoji?: string;
}

// 🔹 Status and Content types for better type safety
type MessageStatus = "sent" | "sending" | "delivered" | "seen" | "invalid";
type ContentType = "text" | "image" | "video" | "file" | "audio";

// 🔹 Main message interface
export interface IMessage {
  senderID: string;
  receiverID: string;
  conversationID: string;
  content: string;
  contentType: ContentType;
  status: MessageStatus;
  reactions: IReaction[];  // Changed from 'react' to more descriptive 'reactions'
  createdAt?: Date;
  updatedAt?: Date;
}

// 🔹 Document type
export interface IMessageDocument extends IMessage, Document {}

// 🔹 Message schema
const reactionSchema = new Schema<IReaction>({
  userID: { type: String, required: true },
  emoji: { type: String }
}, { _id: false });  // No need for _id in subdocuments

const messageSchema = new Schema<IMessageDocument>(
  {
    senderID: { type: String, required: true },
    receiverID: { type: String, required: true },
    conversationID: { type: String, required: true },
    content: { type: String, required: true },
    contentType: {
      type: String,
      enum: ["text", "image", "video", "file", "audio"],
      default: "text",
    },
    reactions: [reactionSchema],  // Using the defined reactionSchema
    status: {
      type: String,
      enum: ["sent", "sending", "delivered", "seen", "invalid"],
      default: "sent",
    },
  },
  { 
    timestamps: true,
    collection: "messages"  // Explicit collection name
  }
);

// 🔹 Group message schema (optional - not exported or used yet)
const groupMessageSchema = new Schema<IMessageDocument>(
  {
    senderID: { type: String, required: true },
    conversationID: { type: String, required: true },
    content: { type: String, required: true },
    contentType: {
      type: String,
      enum: ["text", "image", "video", "file", "audio"],
      default: "text",
    },
    reactions: [reactionSchema],  // Consistent naming
    status: {
      type: String,
      enum: ["sent", "sending", "delivered", "seen", "invalid"],
      default: "sending",
    },
  },
  { 
    timestamps: true,
    collection: "group_messages"  // Explicit collection name
  }
);

// 🔹 Create the model with proper typing
const Message: Model<IMessageDocument> = mongoose.models.Message || 
  mongoose.model<IMessageDocument>("Message", messageSchema);

export default Message;