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

  
  // console.log(message)
  message.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // console.log(message)



  // 2. Change the display area
  const displayDiv = document.getElementById("contactName");
  displayDiv.textContent = `${contactName}`;

  // Optional: Add visual feedback

  const filteredMessage = filterMessage(message, userID, contactID);
  console.log(filteredMessage);
  
  filteredMessage.reverse().forEach((message) => {
    const bool = userID == message.senderID;
    displayMessage(message.content, bool);
  });
};

// Optional: Add hover effects via JavaScript
document.querySelectorAll(".contact-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "scale(1.02)";
    card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "scale(1)";
    card.style.boxShadow = "none";
  });
});



// -- //

const menuItems = [
  { icon: 'fa-edit', text: 'Edit', action: () => console.log('Edit clicked') },
  { icon: 'fa-copy', text: 'Copy', action: () => console.log('Copy clicked') },
  { type: 'divider' },
  { icon: 'fa-smile', text: 'React', action: () => console.log('React clicked') },
  { type: 'divider' },
  { icon: 'fa-trash', text: 'Delete', action: () => console.log('Delete clicked'), class: 'danger' },
];

function displayMessage(text, isMine) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add(isMine ? "myText" : "text");

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
  messageDiv.appendChild(container);  // Attach to messageDiv

  

  // Menu button
  const menuButton = document.createElement('div');
  menuButton.className = 'menu-button';
  menuButton.textContent = '⋮';
  container.appendChild(menuButton);

  // Popup menu
  const popupMenu = document.createElement('div');
  popupMenu.className = 'popup-menu';
  container.appendChild(popupMenu);


// Dynamically position the menu based on who sent the message
if (isMine) {
  container.style.right = '0.25rem';
  container.style.left = 'auto';
  popupMenu.style.left = '0';
  popupMenu.style.left = 'auto';
} else {
  container.style.left = '0.25rem';
  container.style.right = 'auto';
  popupMenu.style.right = '0';
  popupMenu.style.right = 'auto';
}


  // Menu items
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

      const text = document.createElement('span');
      text.textContent = item.text;
      menuItem.appendChild(text);

      menuItem.addEventListener('click', () => {
        item.action();
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

  // Toggle popup
  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    popupMenu.classList.toggle('show');
  });

  // Hide popup on outside click
  document.addEventListener('click', (e) => {
    if (!popupMenu.contains(e.target) && e.target !== menuButton) {
      popupMenu.classList.remove('show');
    }
  });

  // Finally append message to the actual container on the page
  document.getElementById('content').appendChild(messageContainer);
}


function filterMessage(localMessage, senderID, receiverID) {
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