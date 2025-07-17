import { MenuFunctions } from "./menu.function.js";
import { handleEmojiSelection, createReactionContainer } from "./reaction.helper.js";

const userID = localStorage.getItem("user_id");

export default function initMessage (event) {
  const messageElement = document.getElementById("content");
  messageElement.textContent = "";

  const clickedCard = event.target.closest(".contact-card");
  if (!clickedCard) return;

  // Get the message and user_id in local storage
  let message = JSON.parse(localStorage.getItem("messageData")) || [];

  // 1. Get data from the clicked contact card
  const contactName = clickedCard.querySelector(".personName").textContent;
  const contactID = clickedCard.id;
  
  message.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 2. Change the display area
  const displayDiv = document.getElementById("contactName");
  displayDiv.textContent = `${contactName}`;

  // Optional: Add visual feedback
  message.forEach(message => {
  });
  const filteredMessage = filterMessage(message, userID, contactID);
  
  filteredMessage.reverse().forEach((message) => {
    const bool = userID == message.senderID;
    displayMessage(message.content, bool, message._id, message.reactions);
  });
};

const menuItems = [
  { 
    icon: 'fa-edit', 
    text: 'Edit', 
    action: (messageElement) => MenuFunctions.edit(messageElement)
  },
  { type: 'divider' },
  { 
    icon: 'fa-copy', 
    text: 'Copy', 
    action: (messageElement) => MenuFunctions.copy(messageElement)
  },
  { type: 'divider' },
  { 
    icon: 'fa-smile', 
    text: 'React', 
    action: (messageElement) => MenuFunctions.react(messageElement)
  },
  { type: 'divider' },
  { 
    icon: 'fa-trash', 
    text: 'Delete', 
    action: (messageElement) => MenuFunctions.delete(messageElement),
    class: 'danger' 
  }
];

export function displayMessage(text, isMine, messageId, reactions) {
// do the reaction
  const messageContainer = document.createElement("div");
  messageContainer.classList.add(isMine ? "myText" : "text");
  messageContainer.id = messageId;

  const messageDiv = document.createElement("div");
  messageDiv.className = "message-content";
  messageContainer.appendChild(messageDiv);

  // Text content
  const messageContent = document.createElement("span");
  messageContent.textContent = text;
  messageDiv.appendChild(messageContent);

  // Menu container
  const container = document.createElement('div');
  container.className = 'menu-container';
  messageDiv.appendChild(container);

  // Menu button
  const menuButton = document.createElement('div');
  menuButton.className = 'menu-button';
  menuButton.textContent = '⋮';
  container.appendChild(menuButton);

  // Popup menu
  const popupMenu = document.createElement('div');
  popupMenu.className = 'popup-menu';
  container.appendChild(popupMenu);

  if(reactions instanceof Array) {  
    const emojiMap = {};

    reactions.forEach(r => {
      if (r.emoji) {
        emojiMap[r.emoji] = (emojiMap[r.emoji] || 0) + 1;
      }
    });

    const reactionContainer = createReactionContainer(messageContainer);

    // Render each unique emoji with its count
    Object.entries(emojiMap).forEach(([emoji, count]) => {
      const badge = document.createElement('span');
      badge.className = 'reaction-badge';
      badge.textContent = count > 1 ? `${count}${emoji}` : emoji;
      reactionContainer.appendChild(badge);
    });
}

  // Position based on message ownership
  if (isMine) {
    container.style.right = '0.05rem';
    container.style.left = 'auto';
    popupMenu.style.left = '-15rem';
  } else {
    container.style.left = '0.25rem';
    container.style.right = 'auto';
    popupMenu.style.right = '-15rem';
  }
  popupMenu.style.top = '-8.5rem';

  // Create menu items
  menuItems.forEach(item => {
    if (item.type === 'divider') {
      const divider = document.createElement('div');
      divider.className = 'divider';
      popupMenu.appendChild(divider);
    } else {
      const menuItem = document.createElement('div');
      menuItem.className = `menu-item ${item.class || ''}`;

      const icon = document.createElement('i');
      icon.className = `fas ${item.icon}`;
      menuItem.appendChild(icon);

      const textSpan = document.createElement('span');
      textSpan.textContent = item.text;
      menuItem.appendChild(textSpan);

      menuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        item.action(messageContainer); // Pass the message container
        popupMenu.classList.remove('show');
        
        // Visual feedback
        menuItem.style.backgroundColor = 'rgba(0,0,0,0.1)';
        setTimeout(() => {
          menuItem.style.backgroundColor = '';
        }, 300);
      });

      popupMenu.appendChild(menuItem);
    }
  });

  // Toggle menu visibility
  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    popupMenu.classList.toggle('show');
  });

  // Close menu when clicking outside
  document.addEventListener('click', () => {
    popupMenu.classList.remove('show');
  });

  document.getElementById('content').appendChild(messageContainer);
}

function filterMessage(localMessage, userID, receiverID) {
  // 1. Handle case where localMessage isn't an array
  if (!Array.isArray(localMessage)) {
    console.error("filterMessages: Expected array, got", typeof localMessage);
    return [];
  }

  // 2. Use filter() instead of forEach for cleaner code
  return localMessage.filter((message) => {
    // 3. Check if message exists and has the property
    if (!message || typeof message !== "object") return false;

  const isValidPair = {
  [`${userID}-${receiverID}`]: true,
  [`${receiverID}-${userID}`]: true
  };

// Usage:
    if (isValidPair[`${message.senderID}-${message.receiverID}`]) return message;
  });
}
