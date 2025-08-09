import { displayMessage } from "./chatAction/displayMessage.js";
import { socket } from "./socket/socket.event.js";

const inputMessage = document.getElementById("inputMessage");
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
const userID = localStorage.getItem("user_id");
const messageSave = new SaveToLocalStorage();
let messages = JSON.parse(localStorage.getItem("messageData")) || [];
let receiverID = null;
let conversationID = null;

// Socket Connection


// Event Listeners
// sendButton?.addEventListener("click", sendMessage);

inputMessage?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

let oldConversationID = null;

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

  let currentConversationID = existingConversations[0];
  conversationID = currentConversationID;

  if(oldConversationID === null) {
    socket.emit("joinConversation", currentConversationID); 
    oldConversationID = currentConversationID;
  } else {
    if(oldConversationID === currentConversationID) return;
    socket.emit("joinConversation", currentConversationID);
    socket.emit("leaveRoom", oldConversationID);
    oldConversationID = currentConversationID;
  }
});

// Handle incoming messages
socket.on("receiveMessage", (data) => {
  console.log("recieveMessage");
  if (!isValidMessage(data)) return;
  processIncomingMessage(data);
  
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
  return `${[id1, id2].sort().join('_')}}`;
}

export function isValidMessage(data) {
  return data?.content && data?.senderID && data?.conversationID;
}

export function processIncomingMessage(data) {
  const isMine = data.senderID === userID;
  displayMessage(data.content, isMine, data._id, data.reactions, data.createdAt, data.receiverID);

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
    reactions: [{ userID: userID, emoji: "" }, { userID: receiverID, emoji: "" }],
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



document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchMessage');
  const messageContainer = document.getElementById('content');
  
  // Store original messages
  let originalMessages = Array.from(messageContainer.children).map(msg => {
    return {
      element: msg,
      text: msg.querySelector('.message-content span')?.textContent || ''
    };
  });

  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    
    if (searchTerm === '') {
      // Restore original messages
      messageContainer.innerHTML = '';
      originalMessages.forEach(item => {
        messageContainer.appendChild(item.element.cloneNode(true));
      });
      return;
    }
    
    // Filter and highlight messages
    messageContainer.innerHTML = '';
    originalMessages.forEach(item => {
      if (item.text.toLowerCase().includes(searchTerm)) {
        const clone = item.element.cloneNode(true);
        const messageSpan = clone.querySelector('.message-content span');
        
        if (messageSpan) {
          const highlightedText = item.text.replace(
            new RegExp(searchTerm, 'gi'),
            match => `<span class="highlight">${match}</span>`
          );
          messageSpan.innerHTML = highlightedText;
        }
        
        messageContainer.appendChild(clone);
      }
    });
  });
});



