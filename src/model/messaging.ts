import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    content: { type: String, trim: true, required: true },
    userID: { type: String, required: true },
    replied: { type: Schema.Types.ObjectId, ref: "messages", required: true },
    react: { type: String },
  },
  { timestamps: true }
);

const contactSchema = new Schema(
  {
    userID: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const conversationSchema = new Schema(
  {
    users: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const messageModel = mongoose.model("messages", messageSchema);
const contactModel = mongoose.model("contacts", contactSchema);
const conversationModel = mongoose.model("conversations", conversationSchema);

export default { messageModel, contactModel, conversationModel }; // Or export them individually
