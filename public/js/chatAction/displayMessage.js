import { MenuFunctions } from "./menu.function.js";
import { handleEmojiSelection, createReactionContainer } from "./reaction.helper.js";


export default function initMessage (event) {
  const messageElement = document.getElementById("content");
  messageElement.textContent = "";

  const clickedCard = event.target.closest(".contact-card");
  if (!clickedCard) return;

  // Get the message and user_id in local storage
  let message = JSON.parse(localStorage.getItem("messageData")) || [];
  const userID = localStorage.getItem("user_id");

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
    displayMessage(message.content, bool, message._id, message.reactions, message.createdAt, message.receiverID);
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

export function displayMessage(text, isMine, messageId, reactions, timestamp, id) {
  console.log(text, +isMine, messageId, reactions, timestamp, id);

  const contactElement = document.getElementById(id);
  if (!contactElement) return;

  const currentTimestamp = new Date(timestamp).getTime();
  const existingTimestamp = parseInt(contactElement.getAttribute("data-timestamp") || '0', 10);

  if (currentTimestamp > existingTimestamp) {
    contactElement.setAttribute("data-timestamp", currentTimestamp);
  }

  const messageContainer = createMessageContainer(isMine, messageId);
  const messageContent = createMessageContent(text);
  messageContainer.appendChild(messageContent);

  const { container, popupMenu } = createMessageMenu(isMine, messageContainer);
  messageContent.appendChild(container);

  if (Array.isArray(reactions)) {
    const reactionContainer = createReactionContainer(messageContainer);
    const emojiMap = aggregateReactions(reactions);
    renderReactions(reactionContainer, emojiMap);
  }

  document.getElementById('content').appendChild(messageContainer);
}

function createMessageContainer(isMine, messageId) {
  const container = document.createElement("div");
  
  if (isMine) {
    container.classList.add("myText");
  } else {
    container.classList.add("text");
  }
  container.id = messageId;  
  return container;
}

function createMessageContent(text) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message-content";

  const span = document.createElement("span");
  span.textContent = text;
  messageDiv.appendChild(span);

  return messageDiv;
}

function createMessageMenu(isMine, messageContainer) {
  const container = document.createElement('div');
  container.className = 'menu-container';

  const menuButton = document.createElement('div');
  menuButton.className = 'menu-button';
  menuButton.textContent = '⋮';
  container.appendChild(menuButton);

  const popupMenu = document.createElement('div');
  popupMenu.className = 'popup-menu';
  container.appendChild(popupMenu);

  setMenuPosition(container, popupMenu, isMine);
  populateMenuItems(popupMenu, messageContainer);
  attachMenuToggle(menuButton, popupMenu);

  return { container, popupMenu };
}

function setMenuPosition(container, popupMenu, isMine) {
  if (isMine) {
    container.style.right = '0.05rem';
    popupMenu.style.left = '-15rem';
  } else {
    container.style.left = '0.25rem';
    popupMenu.style.right = '-15rem';
  }
  popupMenu.style.top = '-8.5rem';
}

function populateMenuItems(popupMenu, messageContainer) {
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
        item.action(messageContainer);
        popupMenu.classList.remove('show');
        flashFeedback(menuItem);
      });

      popupMenu.appendChild(menuItem);
    }
  });
}

function flashFeedback(menuItem) {
  menuItem.style.backgroundColor = 'rgba(0,0,0,0.1)';
  setTimeout(() => {
    menuItem.style.backgroundColor = '';
  }, 300);
}

function attachMenuToggle(menuButton, popupMenu) {
  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    popupMenu.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    popupMenu.classList.remove('show');
  });
}

function aggregateReactions(reactions) {
  return reactions.reduce((map, r) => {
    if (r.emoji) {
      map[r.emoji] = (map[r.emoji] || 0) + 1;
    }
    return map;
  }, {});
}

function renderReactions(container, emojiMap) {
  Object.entries(emojiMap).forEach(([emoji, count]) => {
    const badge = document.createElement('span');
    badge.className = 'reaction-badge';
    badge.textContent = count > 1 ? `${count}${emoji}` : emoji;
    container.appendChild(badge);
  });
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
