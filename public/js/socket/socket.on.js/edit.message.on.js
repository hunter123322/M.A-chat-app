import { createReactionContainer, handleEmojiSelection } from "../../chatAction/reaction.helper.js";
import { renderDeletedMessage, renderEditedMessage } from "../../chatAction/render.edited.message.js";
// import { conversationID } from "../../messageListaction.js";

export function receiveEditMessage( socket ){
    socket.on("messageEdited", (updatedMessage) => {
    // Get current messages from localStorage
    const messageData = JSON.parse(localStorage.getItem('messageData'));
    
    // Find and update the message
    const updatedMessages = messageData.map(msg => 
        msg._id === updatedMessage._id ? updatedMessage : msg
    );
    
    // Save back to localStorage
    localStorage.setItem('messageData', JSON.stringify(updatedMessages));
    
    // Trigger any UI updates (depending on your framework)
    renderEditedMessage(message.content, message._id);
    });
}

export function receiveReactMessage( socket ){
    socket.on("messageReacted", async (reaction) => {

      const messageContainer = document.getElementById(reaction._id)
      messageContainer.querySelector('.message-content .reactions').remove()

    // Get current messages from localStorage
    const messageData = JSON.parse(localStorage.getItem('messageData'));
    
    // Find and update the message
    const updatedMessages = messageData.map(msg => 
        msg._id === reaction._id ? reaction : msg
    );    
    // Save back to localStorage
    localStorage.setItem('messageData', JSON.stringify(updatedMessages));



    // Trigger any UI updates (depending on your framework)
const emojiMap = {};

reaction.reactions.forEach(r => {
  if (r.emoji) {
    emojiMap[r.emoji] = (emojiMap[r.emoji] || 0) + 1;
  }
});

const reactionContainer = createReactionContainer(messageContainer);

// Render each unique emoji with its count
Object.entries(emojiMap).forEach(([emoji, count]) => {
  const badge = document.createElement('span');
  badge.className = 'reaction-badge';
  badge.id = ""
  badge.textContent = count > 1 ? `${count}${emoji}` : emoji;
  reactionContainer.appendChild(badge);
});
    });
}

export function receiveDeletedMessage(socket) {
  socket.on("deleteMessage", async (messageID) => {
    let messageData = JSON.parse(localStorage.getItem("messageData")) || [];
    

    // Remove the message with the given ID
    messageData = messageData.filter(message => message._id !== messageID);

    // Update localStorage
    localStorage.setItem("messageData", JSON.stringify(messageData));
    renderDeletedMessage(messageID)

  });
}


const contactList = document.getElementById("contactList").addEventListener("click", (event) => {
  let messages = JSON.parse(localStorage.getItem("messageData")) || [];  
  const userID = localStorage.getItem("user_id");

  const clickedCard = event.target.closest(".contact-card");
    if (!clickedCard) return;

      const receiverID = clickedCard.id;

  const existingConversations = [...new Set(
    messages
      .filter(msg =>
        (msg.senderID === userID && msg.receiverID === receiverID) ||
        (msg.senderID === receiverID && msg.receiverID === userID)
      )
      .map(msg => msg.conversationID)
  )];

  return existingConversations;
});

class SaveToLocalStorage {
  save(messages) {
    try {
      localStorage.setItem("messageData", JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save messages:", e);
    }
  }
}

export function newMessageNotification(socket){
  let messages = JSON.parse(localStorage.getItem("messageData")) || [];  
  const messageSave = new SaveToLocalStorage();

  socket.on("newMessageNotification", async (notification) => {
    const currentConversationID = contactList;
    if (currentConversationID !== notification.conversationID) {
      console.log(notification, "nitification");
      const {message} = notification;

      messages.push({ ...message, updatedAt: new Date() });
      messageSave.save(messages);
    }
  });
}
