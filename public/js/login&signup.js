"use strict";
document
  .getElementById("login-tab")
  .addEventListener("click", () => showForm("login"));
document
  .getElementById("signup-tab")
  .addEventListener("click", () => showForm("signup"));
document
  .getElementById("signup")
  .addEventListener("submit", (event) => handleSignUpSubmit(event));
function showForm(formType) {
  const formElements = {
    loginForm: document.getElementById("login-form"),
    signupForm: document.getElementById("signup-form"),
    loginTab: document.getElementById("login-tab"),
    signupTab: document.getElementById("signup-tab"),
  };
  const isLogin = formType === "login";
  formElements.loginForm.classList.toggle("active", isLogin);
  formElements.signupForm.classList.toggle("active", !isLogin);
  formElements.loginTab.classList.toggle("active", isLogin);
  formElements.signupTab.classList.toggle("active", !isLogin);
}

const loginShowError = (message) => {
  const oldError = document.getElementById("login-error");
  if (oldError) oldError.remove();
  const errorMsg = document.createElement("div");
  errorMsg.id = "login-error";
  errorMsg.style.color = "red";
  errorMsg.style.marginTop = "10px";
  errorMsg.textContent = message;
  const form = document.getElementById("login-form");
  if (form) {
    form.appendChild(errorMsg);
  }
};

const signupShowError = (message) => {
  const oldError = document.getElementById("login-error");
  if (oldError) oldError.remove();

  const errorMsg = document.createElement("div");
  errorMsg.id = "login-error";
  errorMsg.style.color = "red";
  errorMsg.style.marginTop = "10px";
  errorMsg.textContent = message;
  const form = document.getElementById("signup-form");
  if (form) {
    form.appendChild(errorMsg);
  }
};

function validateForm(email, password, confirmPassword) {
  if (!email || !password || !confirmPassword) {
    return { isValid: false, message: "All fields are required!" };
  }
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long.",
    };
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match!" };
  }
  return { isValid: true };
}

function enableSubmitButton(button) {
  if (button) {
    button.disabled = false;
  }
}

async function submitForm(data) {
  const response = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

async function handleResponse(result) {
  if (!result.status === 200) {
    signupShowError("Login failed: " + (result.error ?? "Invalid credentials"));
  } else {
    window.location.href = "/signup/information";
  }
}

// Sign up submit
async function handleSignUpSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.querySelector("#signup-email").value;
  const password = form.querySelector("#signup-password").value;
  const confirmPassword = form.querySelector("#confirm-password").value;
  const validationResult = validateForm(email, password, confirmPassword);

  if (!validationResult.isValid) {
    signupShowError("Signup failed: " + validationResult.message);
    return;
  }

  const data = { username: email, password };

  try {
    const response = await submitForm(data);
    localStorage.setItem("userData", JSON.stringify(response.username));
    handleResponse(response);
    console.log(response.status);
  } catch (error) {
    signupShowError("Login failed: " + (error.error ?? "Invalid credentials"));
  } finally {
    const submitButton = form.querySelector("button[type='submit']");
    enableSubmitButton(submitButton);
  }
}

// log in submit
document.getElementById("login")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const loginData = { username, password };
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.user_id) {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("messageData", JSON.stringify(data.messages));
      }
      window.location.href = `/socket/v1?user=${data.user_id}`;
    } else {
      loginShowError("Login failed: " + (data.error ?? "Invalid credentials"));
    }
  } catch (error) {
    loginShowError("An error occurred. Please try again.");
  }
});
//# sourceMappingURL=login&signup.js.map
