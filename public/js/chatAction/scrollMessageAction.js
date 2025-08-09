export default function loadOlderMessage(content, messageBody) {
  if (!content || !messageBody) return;

  const oldScrollHeight = messageBody.scrollHeight;
  if (typeof oldScrollHeight !== 'number') return;

  const newMessages = generateMockMessages(3);
  newMessages.forEach(msg => content.prepend(msg));

  const newScrollHeight = messageBody.scrollHeight;
  maintainScrollPosition(messageBody, oldScrollHeight, newScrollHeight);
}

// Generates mock message elements
function generateMockMessages(count) {
  return Array.from({ length: count }, () => {
    const msg = document.createElement("div");
    msg.className = "text"; // or "myText" if needed
    msg.textContent = `Earlier message ${Date.now()}`;
    return msg;
  });
}

// Adjusts scroll to maintain visual position
function maintainScrollPosition(element, oldHeight, newHeight) {
  const delta = newHeight - oldHeight;
  element.scrollTop += delta;
}
