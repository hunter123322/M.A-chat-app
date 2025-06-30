const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = mongoose;

const MessageSchema = new Schema({
  senderID: { type: mongoose.Schema.ObjectId, required: true },
  receiverID: { type: mongoose.Schema.ObjectId, required: true },
  conversationID: { type: mongoose.Schema.ObjectId, required: true },
  content: { type: String, trim: true, required: true },
  react: { type: String, trim: true }
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);

// Generate 50 mock messages
