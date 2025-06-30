import mongoose from "mongoose";

// Assume Message model is already defined with timestamps
const Message = mongoose.model("Message");

// Function to get paginated messages
async function getPaginatedMessages(lastTimestamp?: Date): Promise<any[]> {
  const query: any = {};

  if (lastTimestamp) {
    query.createdAt = { $lt: lastTimestamp }; // Only get older messages
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 }) // Newest to oldest
    .limit(100);

  return messages;
}

// Example usage:
async function exampleUsage() {
  const page1 = await getPaginatedMessages(); // First 100 newest

  if (page1.length > 0) {
    const lastTimestamp = page1[page1.length - 1].createdAt;
    const page2 = await getPaginatedMessages(lastTimestamp); // Next 100
    console.log("Page 2:", page2);
  }
}
