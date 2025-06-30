export default function popupMenu(){

  const optionButton = document.getElementById("messagInputOption");
  const popupMenu = document.getElementById("popupMenu");

  if (!optionButton || !popupMenu) return;

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  optionButton.addEventListener("click", () => {
    popupMenu.classList.toggle("hidden");
  });

  document.querySelectorAll(".popupOption").forEach((btn) => {
    btn.addEventListener("click", (e) => {f
      const target = e.currentTarget;
      const type = target.dataset.type;

      // Filter accepted file types
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