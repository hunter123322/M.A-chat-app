export default function popupMenu(){

  const optionButton = document.getElementById("messagInputOption");
  const popupMenu = document.getElementById("popupMenu");

  if (!optionButton || !popupMenu) return;

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

// Toggle popup on icon/button click
optionButton.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent it from immediately closing
  popupMenu.classList.toggle("hidden");
});

// Close popup when clicking outside
document.addEventListener("click", (e) => {
  const isClickInsidePopup = popupMenu.contains(e.target);
  const isClickOnButton = optionButton.contains(e.target);
  
  if (!isClickInsidePopup && !isClickOnButton) {
    popupMenu.classList.add("hidden");
  }
});


// Your existing code for option clicks
document.querySelectorAll(".popupOption").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevents the document click from firing immediately
    const target = e.currentTarget;
    const type = target.dataset.type;

    switch (type) {
      case "png":
        fileInput.accept = "image/png";
        break;
      case "video":
        fileInput.accept = "video/*";
        break;
      case "gif":
        fileInput.accept = "image/gif";
        break;
      case "file":
        fileInput.accept = "*/*";
        break;
      default:
        fileInput.accept = "";
    }

    fileInput.click();
    popupMenu.classList.add("hidden");
  });
});


  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`File uploaded successfully: ${data.url}`);
        // Optionally: append link to message box
      })
      .catch((err) => {
        console.error("Upload failed", err);
        alert("Upload failed.");
      });
  });

}