const contactSearch = document.getElementById("contactSearch");
const contacts = document.querySelectorAll("#contactName");
const messageBody = document.getElementById("messageBody");
const content = document.getElementById("content");

import initMessage from "./displayMessage.js";
import popUpMenu from "./popUpMenu.js";
import loadOlderMessage from "./scrollMessageAction.js";


contactSearch?.addEventListener("input", () => {
  const query = contactSearch.value.toLowerCase();
  contacts.forEach((contact) => {
    const name = contact.querySelector("#personName").textContent.toLowerCase();
    contact.style.display = name.includes(query) ? "block" : "none";
  });
});

document.addEventListener("DOMContentLoaded", popUpMenu);

document.getElementById("contactList").addEventListener("click", (event) => {
    initMessage(event)
})

loadOlderMessage(content, messageBody)
messageBody.addEventListener("scroll", () => {
  if (messageBody.scrollTop === 0) {
    loadOlderMessage(); 
  }
});
