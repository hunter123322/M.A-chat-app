import { createReactionContainer, handleEmojiSelection } from "../../chatAction/reaction.helper.js";
import { renderEditedMessage } from "../../chatAction/render.edited.message.js";

export function receiveEditMessage( socket ){
    socket.on("messageEdited", (updatedMessage) => {
    // Get current messages from localStorage
    const messageData = JSON.parse(localStorage.getItem('messageData'));
    
    // Find and update the message
    const updatedMessages = messageData.map(msg => 
        msg._id === updatedMessage._id ? updatedMessage : msg
    );
    
    // Save back to localStorage
    localStorage.setItem('messageData', JSON.stringify(updatedMessages));
    
    // Trigger any UI updates (depending on your framework)
    renderEditedMessage(message.content, message._id);
    });
}

export function receiveReactMessage( socket ){
    socket.on("messageReacted", (reaction) => {
    // Get current messages from localStorage
    const messageData = JSON.parse(localStorage.getItem('messageData'));
    
    // Find and update the message
    const updatedMessages = messageData.map(msg => 
        msg._id === reaction._id ? reaction : msg
    );
    
    // Save back to localStorage
    localStorage.setItem('messageData', JSON.stringify(updatedMessages));

    // Trigger any UI updates (depending on your framework)
      if (true) {
      const reactionContainer = createReactionContainer(messageContainer);
      if (reactionContainer) {
        handleEmojiSelection(
          document.createElement('button'),
          reaction,
          reactionContainer,
          null,
          messageId
        );
      }
    }
    });
}