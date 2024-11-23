const socket = io();
const randomId = uuid.v4(); // Generates a new UUID

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

socket.emit("userID", randomId);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chatMessage", input.value);

    const item = document.createElement("li");
    const displayMessage = `${randomId} : ${input.value}`;
    item.textContent = displayMessage;
    document.getElementById("messages").appendChild(item);

    input.value = "";
  }
});

socket.on("chatMessages", (msg) => {
  const item = document.createElement("li");
  const displayMessage = `${msg.userID} : ${msg.content}`;
  item.textContent = displayMessage;
  document.getElementById("messages").appendChild(item);
});
