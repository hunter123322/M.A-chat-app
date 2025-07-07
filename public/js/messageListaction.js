
import { displayMessage } from "./chatAction/displayMessage.js";
// DOM Elements
const sendButton = document.getElementById("sendButton");
const inputMessage = document.getElementById("inputMessage");
const messageContainer = document.getElementById("content");
const searchMessage = document.querySelectorAll("#searchContact")[1];
const contactList = document.getElementById("contactList");

// Message storage class (PascalCase)
class SaveToLocalStorage {
  save(messages) {
    try {
      localStorage.setItem("messageData", JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save messages:", e);
    }
  }
}

// User and Connection Setup
const userID = localStorage.getItem("user_id") || `temp-${Date.now()}`;
const messageSave = new SaveToLocalStorage();
let messages = JSON.parse(localStorage.getItem("messageData")) || [];
let receiverID = null;
let conversationID = null;

// Socket Connection
const socket = io("http://localhost:3000", {
  auth: { user_id: userID },
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Event Listeners
// sendButton?.addEventListener("click", sendMessage);

inputMessage?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

contactList?.addEventListener("click", (event) => {
  const clickedCard = event.target.closest(".contact-card");
  if (!clickedCard) return;

  receiverID = clickedCard.id;

  // Find or create conversation
  const existingConversations = [...new Set(
    messages
      .filter(msg =>
        (msg.senderID === userID && msg.receiverID === receiverID) ||
        (msg.senderID === receiverID && msg.receiverID === userID)
      )
      .map(msg => msg.conversationID)
  )];

  conversationID = existingConversations[0] || generateConversationID(userID, receiverID);

  socket.emit("joinConversation", conversationID);
  // loadConversationHistory();
});

// Handle incoming messages
socket.on("recieveMessage", (data) => {
  if (!isValidMessage(data) || data.conversationID !== conversationID) return;
  processIncomingMessage(data);
  console.log("recieveMessage");
  
});

function sendMessage() {
  const text = inputMessage.value.trim();
  if (!validateSendConditions(text)) return;

  const messageData = createMessageData(text);
  sendToServer(messageData);
  resetInput();
}

// Helper Functions
function generateConversationID(id1, id2) {
  return `${[id1, id2].sort().join('_')}_${Date.now()}`;
}

function isValidMessage(data) {
  return data?.content && data?.senderID && data?.conversationID;
}

function processIncomingMessage(data) {
  const isMine = data.senderID === userID;
  displayMessage(data.content, isMine, data._id);

  const exists = messages.some(m =>
    m.content === data.content &&
    m.senderID === data.senderID &&
    m.conversationID === data.conversationID &&
    Math.abs(new Date(m.createdAt) - new Date(data.createdAt)) < 1000
  );

  if (!exists) {
    messages.push({ ...data, updatedAt: new Date() });
    messageSave.save(messages);
  }

}

function validateSendConditions(text) {
  return text && receiverID && conversationID;
}

function createMessageData(text) {
  return {
    senderID: userID,
    receiverID: receiverID,
    conversationID: conversationID,
    content: text,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function sendToServer(messageData) {
  socket.emit("chatMessage", messageData);
}

function resetInput() {
  inputMessage.value = "";
}

