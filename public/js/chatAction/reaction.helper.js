import { EmitMenuAction } from "../socket/socket.event.js";


/**
 * Creates or retrieves the reaction container element inside a message element.
 * This container holds the emoji picker and all added emoji badges.
 *
 * @param {HTMLElement} messageElement - The message DOM element
 * @returns {HTMLElement} - The container for emoji reactions
 */
export function createReactionContainer(messageElement) {
  return messageElement.querySelector('.reactions') || (() => {
    const container = document.createElement('div');
    container.className = 'reactions';
    messageElement.querySelector('.message-content').appendChild(container);
    return container;
  })();
}

/**
 * Creates an emoji picker with predefined emojis and binds the click handler
 * for each emoji button.
 *
 * @param {HTMLElement} reactionContainer - The container where emojis will be rendered
 * @param {HTMLElement} messageElement - The message element containing the ID
 * @returns {HTMLElement} - The DOM element representing the emoji picker
 */
export function createEmojiPicker(reactionContainer, messageElement) {
  const emojiPicker = document.createElement('div');
  emojiPicker.className = 'emoji-picker';

  const emojis = ['😀', '❤️', '👍', '😂', '😮']; // Define supported emojis

  emojis.forEach((emoji) => {
    const button = document.createElement('button');
    button.textContent = emoji;

    // When an emoji is clicked, trigger reaction logic
    button.onclick = (e) => {
      e.stopPropagation(); // Prevent click from closing picker immediately
      handleEmojiSelection(button, emoji, reactionContainer, emojiPicker, messageElement.id);
    };

    emojiPicker.appendChild(button);
  });

  return emojiPicker;
}

/**
 * Handles the UI and socket logic when an emoji is selected.
 * Adds the emoji visually and emits the reaction to the server.
 *
 * @param {HTMLElement} button - The emoji button clicked
 * @param {string} emoji - The selected emoji
 * @param {HTMLElement} reactionContainer - The parent container for emoji reactions
 * @param {HTMLElement} emojiPicker - The emoji picker element (to remove)
 * @param {string} messageId - ID of the message being reacted to
 */
export function handleEmojiSelection(button, emoji, reactionContainer, emojiPicker, messageId) {
  // Simple click animation
  button.style.transform = 'scale(1.3)';
  setTimeout(() => {
    button.style.transform = '';
  }, 200);

  // Add emoji badge to the message UI
  const badge = document.createElement('span');
  badge.className = 'reaction-badge';
  badge.textContent = emoji;
  reactionContainer.appendChild(badge);

  // Emit the emoji reaction to the server
  const userID = localStorage.getItem("user_id");
  EmitMenuAction.messageReaction(messageId, emoji, userID);

  // Close the picker
  if(emojiPicker){
  emojiPicker.remove();
  }
}

/**
 * Sets up a temporary global click handler to close the emoji picker
 * if the user clicks outside of it.
 *
 * @param {HTMLElement} reactionContainer - The container holding the emoji picker
 * @param {HTMLElement} emojiPicker - The emoji picker element to remove
 */
export function setupOutsideClickHandler(reactionContainer, emojiPicker) {
  const clickHandler = (e) => {
    if (!reactionContainer.contains(e.target)) {
      emojiPicker.remove();
      document.removeEventListener('click', clickHandler);
    }
  };

  // Defer the event listener to the next tick so the initial click doesn't trigger it
  setTimeout(() => {
    document.addEventListener('click', clickHandler);
  }, 0);
}
