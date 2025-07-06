import { Socket } from "socket.io";

export function joinConversationEvent(socket: Socket) {
    socket.on("joinConversation", (conversationID: string) => {
        socket.join(conversationID);
        console.log(`User ${socket.id} joined conversation ${conversationID}`);
    });
}