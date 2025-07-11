export function renderEditedMessage(editedText, textID) {
  const message = document.getElementById(textID);
  if (!message) return;

  const span = message.querySelector(".message-content span");
  if (span && editedText !== null) {
    span.textContent = editedText;
  }
}

export function renderMessageReaction(){}