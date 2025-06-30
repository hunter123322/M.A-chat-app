"use strict";
document.getElementById("addressForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = {
        country: document.getElementById("country").value,
        region: document.getElementById("region").value,
        district: document.getElementById("district").value,
        municipality: document.getElementById("municipality").value,
        barangay: document.getElementById("barangay").value,
        zone: document.getElementById("zone").value,
        house_number: document.getElementById("house_number").value,
    };
    const responseMessage = document.getElementById("responseMessage");
    responseMessage.style.display = "block";
    responseMessage.textContent = JSON.stringify(formData, null, 2);
    try {
        await sendUserLocationRequest(formData);
    }
    catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
    }
});
async function sendUserLocationRequest(userLocation) {
    try {
        const submitButton = document.getElementById("signup-btn");
        if (submitButton) {
            submitButton.disabled = true;
        }
        else {
            console.error("Submit button not found");
        }
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
        }
        else {
            throw new Error("No redirect URL found in response");
        }
    }
    catch (error) {
        console.error(error);
        alert("An error occurred while submitting the data.");
    }
}
//# sourceMappingURL=userLocation.js.map