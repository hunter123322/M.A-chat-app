export function editMessage(messageId, editedMessage) {
    console.log("editMessage");
    
  if (
    typeof messageId !== 'string' || !messageId.trim() ||
    typeof editedMessage !== 'string' || !editedMessage.trim()
  ) {
    console.warn("Invalid messageId or editedMessage");
    return;
  }

  const data = { messageId: messageId, editedMessage: editedMessage };
  return data;
}