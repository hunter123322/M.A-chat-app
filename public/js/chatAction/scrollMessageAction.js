export default function loadOlderMessage(content, messageBody) {
  const oldScrollHeight = messageBody.scrollHeight;

  for (let i = 0; i < 3; i++) {
    const msg = document.createElement("div");
    msg.classList.add("text"); // or "myText"
    msg.textContent = `Earlier message ${Date.now()}`;
    content.prepend(msg);
  }

  // Maintain scroll position after inserting new content
  const newScrollHeight = messageBody.scrollHeight;
  messageBody.scrollTop += newScrollHeight - oldScrollHeight;
}