const contactSearch = document.getElementById("contactSearch");
const contacts = document.querySelectorAll("#contactName");
const messageBody = document.getElementById("messageBody");
const content = document.getElementById("content");
const person = document.getElementById;


document.addEventListener("DOMContentLoaded", () => {
  const optionButton = document.getElementById("messagInputOption");
  const popupMenu = document.getElementById("popupMenu");

  if (!optionButton || !popupMenu) return;

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  optionButton.addEventListener("click", () => {
    popupMenu.classList.toggle("hidden");
  });

  document.querySelectorAll(".popupOption").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const type = target.dataset.type;

      // Filter accepted file types
      switch (type) {
        case "png":
          fileInput.accept = "image/png";
          break;
        case "video":
          fileInput.accept = "video/*";
          break;
        case "gif":
          fileInput.accept = "image/gif";
          break;
        case "file":
          fileInput.accept = "*/*";
          break;
        default:
          fileInput.accept = "";
      }

      fileInput.click();
      popupMenu.classList.add("hidden");
    });
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`File uploaded successfully: ${data.url}`);
        // Optionally: append link to message box
      })
      .catch((err) => {
        console.error("Upload failed", err);
        alert("Upload failed.");
      });
  });
});

// Simulate loading older messages
function loadOlderMessages() {
  const oldScrollHeight = messageBody.scrollHeight;

  for (let i = 0; i < 3; i++) {
    const msg = document.createElement("div");
    msg.classList.add("text"); // or "myText"
    msg.textContent = `Earlier message ${Date.now()}`;
    content.prepend(msg);
  }

  // Maintain scroll position after inserting new content
  const newScrollHeight = messageBody.scrollHeight;
  messageBody.scrollTop += newScrollHeight - oldScrollHeight;
}

// Scroll event listener
messageBody.addEventListener("scroll", () => {
  if (messageBody.scrollTop === 0) {
    loadOlderMessages(); // Load older messages when scrolled to top
  }
});

// ???????????

document.getElementById("contactList").addEventListener("click", (event) => {
  const messageElement = document.getElementById("content");
  messageElement.textContent = "";

  const clickedCard = event.target.closest(".contact-card");
  if (!clickedCard) return;

  // Get the message and user_id in local storage
  const localMessage = JSON.parse(localStorage.getItem("messageData")) || [];
  const userID = localStorage.getItem("user_id");

  // 1. Get data from the clicked contact card
  const contactName = clickedCard.querySelector(".personName").textContent;
  const contactID = clickedCard.id;

  // 2. Change the display area
  const displayDiv = document.getElementById("contactName");
  displayDiv.textContent = `${contactName}`;

  // Optional: Add visual feedback

  const filteredMessage = filterMessage(localMessage, userID, contactID);
  filteredMessage.reverse().forEach((message) => {
    const bool = userID == message.senderID;
    displayMessage(message.content, bool);
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
