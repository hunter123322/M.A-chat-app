import mongoose from "mongoose";
import mongoDBconnection from "./controller/mongodbConnection.js"; // ✅ Don't forget `.js` in Bun

await mongoDBconnection();

const messageSchema = new mongoose.Schema({
  senderID: { type: String, required: true },
  receiverID: { type: String, required: true },
  conversationID: { type: String, required: true },
  content: { type: String, trim: true, required: true },
  react: { type: String, trim: true }
}, { timestamps: true });

// ✅ Add collection name if you're unsure
const Message = mongoose.model("Message", messageSchema, "messages");

// ✅ Optional insert
// await Message.create({
//   senderID: "user1",
//   receiverID: "user2",
//   conversationID: "c1",
//   content: "hey",
//   react: "❤️"
// });

// ✅ Read
const a = await Message.find({});
console.log("📨 Messages:", a);
