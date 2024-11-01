import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: { type: String, trim: true },
  },
  { timestamps: true }
);

export default messageSchema ;
