export function sortContactListByTimestamp(containerId) {
  const contactList = document.getElementById(containerId);
  if (!contactList) return console.warn(`Container #${containerId} not found`);

  const contacts = Array.from(contactList.querySelectorAll('.contact-card'));

  contacts.sort((a, b) => {
    const timestampA = Number(a.getAttribute('data-timestamp')) || 0;
    const timestampB = Number(b.getAttribute('data-timestamp')) || 0;
    return timestampA - timestampB; // newest first
  });

  contacts.forEach(contact => contactList.appendChild(contact));
}


