"use strict";
document.getElementById("userForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value.trim();
    const middleName = document.getElementById("middleName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const age = document.getElementById("age").value.trim();
    if (!firstName || !lastName || !age) {
        showResponse("Please fill in all required fields.", "error");
        return;
    }
    if (isNaN(Number(age)) || Number(age) <= 0) {
        showResponse("Please enter a valid age.", "error");
        return;
    }
    const userInfo = { firstName, middleName, lastName, age };
    try {
        await sendUserInformationRequest(userInfo);
        showResponse(`Thank you, ${firstName} ${middleName ? middleName + " " : ""}${lastName}!`, "success");
    }
    catch (error) {
        console.error(error);
        alert("An error occurred while submitting the form. Please try again.");
    }
});
function showResponse(message, type) {
    const responseDiv = document.getElementById("response");
    responseDiv.textContent = message;
    responseDiv.className = `response ${type}`;
}
async function sendUserInformationRequest(userInfo) {
    const submitButton = document.getElementById("signup-btn");
    if (submitButton) {
        submitButton.disabled = true;
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
        console.log(result);
        if (!result) {
            alert("Submission failed. Please try again.");
        }
        else {
            window.location.href = "/signup/location";
        }
    }
    catch (error) {
        console.error(error);
        alert("An error occurred. Please try again.");
    }
    finally {
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
}
//# sourceMappingURL=userInfo.js.map