// Handle form submission
document.getElementById("userForm")!.addEventListener("submit", async function (event: Event): Promise<void> {
  event.preventDefault(); // Prevent the form from submitting normally

  // Get the values from the form inputs
  const firstName = (document.getElementById("firstName") as HTMLInputElement).value.trim();
  const middleName = (document.getElementById("middleName") as HTMLInputElement).value.trim();
  const lastName = (document.getElementById("lastName") as HTMLInputElement).value.trim();
  const age = (document.getElementById("age") as HTMLInputElement).value.trim();

  // Simple validation
  if (!firstName || !lastName || !age) {
    showResponse("Please fill in all required fields.", "error");
    return;
  }

  // Check if age is a valid number
  if (isNaN(Number(age)) || Number(age) <= 0) {
    showResponse("Please enter a valid age.", "error");
    return;
  }

  // Prepare the data to be sent
  const userInfo = { firstName, middleName, lastName, age };

  // Send the request if form data is valid
  try {
    await sendUserInformationRequest(userInfo);
    showResponse(`Thank you, ${firstName} ${middleName ? middleName + " " : ""}${lastName}!`, "success");
  } catch (error) {
    console.error(error);
    alert("An error occurred while submitting the form. Please try again.");
  }
});

// Function to display response message
function showResponse(message: string, type: "error" | "success"): void {
  const responseDiv = document.getElementById("response") as HTMLElement;
  responseDiv.textContent = message;
  responseDiv.className = `response ${type}`;
}

// Function to send the request to the server
async function sendUserInformationRequest(userInfo: { firstName: string, middleName: string, lastName: string, age: string }): Promise<void> {
  const submitButton = document.getElementById("signup-btn") as HTMLButtonElement;
  if (submitButton) {
    submitButton.disabled = true; // Disable submit button while request is in progress
  }

  try {
    const response = await fetch("http://localhost:3000/signup/information", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    const result = await response.json();
    console.log(result)
    if (!result) {
      alert("Submission failed. Please try again.");
    } else {
      window.location.href = "/signup/location"; // Redirect on success
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  } finally {
    // Re-enable the submit button after the request is completed
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}
