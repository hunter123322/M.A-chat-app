import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: { type: String, trim: true },
    userID: { type: String, require: true },
  },
  { timestamps: true }
);

export default messageSchema;
