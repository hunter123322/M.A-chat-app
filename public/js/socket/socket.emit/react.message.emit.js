export function reactMessage(messageId, reaction, userID) {
  return {
    messageID: messageId,
    messageReaction: reaction,
    userID: userID
  };
}
