const contactSearch = document.getElementById("searchContact");
const contacts = document.querySelectorAll(".contact-card");
const messageBody = document.getElementById("messageBody");
const content = document.getElementById("content");

import { sortContactListByTimestamp } from "./contact.sorter.js";
import initMessage from "./displayMessage.js";
import popUpMenu from "./popUpMenu.js";
import loadOlderMessage from "./scrollMessageAction.js";

contactSearch?.addEventListener("input", () => {
  const query = contactSearch.value.toLowerCase();

  contacts.forEach((contact) => {
    const name = contact.querySelector(".personName").textContent.toLowerCase();
    contact.style.display = name.includes(query) ? "flex" : "none";
  });
});


document.addEventListener("DOMContentLoaded", popUpMenu);

document.getElementById("contactList").addEventListener("click", (event) => {
    initMessage(event)
});

sortContactListByTimestamp('contactList');

loadOlderMessage(content, messageBody)
messageBody.addEventListener("scroll", () => {
  if (messageBody.scrollTop === 0) {
    loadOlderMessage(); 
  }
});
