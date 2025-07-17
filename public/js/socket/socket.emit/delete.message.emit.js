export function deleteMessage(messageId) {
  if (
    typeof messageId !== 'string' || messageId.trim() === ''
) {
  return;
}

  const data = { messageId: messageId}
  return data;
}

