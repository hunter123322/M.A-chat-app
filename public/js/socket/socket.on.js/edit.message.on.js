import { createReactionContainer, handleEmojiSelection } from "../../chatAction/reaction.helper.js";
import { renderEditedMessage } from "../../chatAction/render.edited.message.js";

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