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

function displayMessage(text, isMine) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(isMine ? "myText" : "text");
  messageDiv.textContent = text;
  messageContainer.appendChild(messageDiv);
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