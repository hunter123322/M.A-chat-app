import { deleteMessage } from "./socket.emit/delete.message.emit.js";
import { editMessage } from "./socket.emit/edit.message.emit.js";
import { reactMessage } from "./socket.emit/react.message.emit.js";
import { newMessageNotification, receiveDeletedMessage, receiveEditMessage, receiveReactMessage } from "./socket.on.js/edit.message.on.js";




const userID = localStorage.getItem("user_id");

export const socket = io("http://localhost:3000", {
  auth: { user_id: userID },
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export class EmitMenuAction {
    static editMessage ( messageId, editedMessage ) {
      const data = editMessage( messageId, editedMessage )
      socket.emit("editMessage", data);
      
    }

    static messageReaction ( messageId, reaction, userID) {
      const data = reactMessage( messageId, reaction, userID)
      console.log(data);
      
      socket.emit("messageReaction", data );
    }

    static deleteMessage ( messageId ) {
      socket.emit("deleteMessage", deleteMessage( messageId ));
      console.log(messageId)
    }
}

receiveEditMessage( socket );
receiveReactMessage( socket )
receiveDeletedMessage( socket );
newMessageNotification( socket )