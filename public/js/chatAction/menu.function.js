import { EmitMenuAction } from "../socket/socket.event.js";
import { renderEditedMessage } from "./render.edited.message.js";
import { createReactionContainer, createEmojiPicker, setupOutsideClickHandler } from "./reaction.helper.js";

export class MenuFunctions {

  static edit(messageElement) {
    const currentText = messageElement.querySelector('.message-content span').textContent;
    const messageId = messageElement.id;

    const newText = prompt('Edit message:', currentText);
    if (newText !== null) {
      renderEditedMessage(newText, messageId);
      EmitMenuAction.editMessage(messageId, newText);
    }
  }

  static copy(messageElement) {
    const textToCopy = messageElement.querySelector('.message-content span').textContent;
    navigator.clipboard.writeText(textToCopy)
      .then(() => console.log('Copied:', textToCopy))
      .catch(err => console.error('Copy failed:', err));
  }

  static react(messageElement) {
    const reactionContainer = createReactionContainer(messageElement);
    const emojiPicker = createEmojiPicker(reactionContainer, messageElement);
    
    reactionContainer.innerHTML = '';
    reactionContainer.appendChild(emojiPicker);
    setupOutsideClickHandler(reactionContainer, emojiPicker);
  }

  static delete(messageElement) {
      if (confirm('Delete this message?')) {
      messageElement.remove();

    const messageId = messageElement.id;
        EmitMenuAction.deleteMessage(messageId)

      console.log('Message deleted');
    }
  }
}
