export function deleteMessage(messageId, userID) {
  if (
    typeof messageId !== 'string' || messageId.trim() === '' ||
    typeof userID !== 'string' || userID.trim() === ''
) {
  return;
}

  const data = { messageId: messageId, userID: userID}
  return data;
}