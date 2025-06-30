// Handle form submission and send request
document.getElementById("addressForm")!.addEventListener("submit", async function (event: Event): Promise<void> {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Collecting the form data
  const formData: Record<string, string> = {
    country: (document.getElementById("country") as HTMLInputElement).value,
    region: (document.getElementById("region") as HTMLInputElement).value,
    district: (document.getElementById("district") as HTMLInputElement).value,
    municipality: (document.getElementById("municipality") as HTMLInputElement).value,
    barangay: (document.getElementById("barangay") as HTMLInputElement).value,
    zone: (document.getElementById("zone") as HTMLInputElement).value,
    house_number: (document.getElementById("house_number") as HTMLInputElement).value,
  };

  // Show the data in the response section
  const responseMessage = document.getElementById("responseMessage") as HTMLElement;
  responseMessage.style.display = "block";
  responseMessage.textContent = JSON.stringify(formData, null, 2); // Convert form data to a nicely formatted string

  try {
    // Call sendRequest to handle form submission
    await sendUserLocationRequest(formData);

  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
});

// Function to send the request
async function sendUserLocationRequest(userLocation: Record<string, string>): Promise<void> {
  try {
    const submitButton = document.getElementById("signup-btn") as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
    } else {
      console.error("Submit button not found");
    }

    // Send POST request with form data
    const response = await fetch("http://localhost:3000/signup/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLocation),
    });

    const result = await response.json();

    if (result && result.redirectUrl) {
      window.location.href = result.redirectUrl;
    } else {
      throw new Error("No redirect URL found in response");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while submitting the data.");
  }
}
