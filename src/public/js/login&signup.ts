document.getElementById("login-tab")!.addEventListener("click", () => showForm("login"));
document.getElementById("signup-tab")!.addEventListener("click", () => showForm("signup"));
document.getElementById("signup")!.addEventListener("submit", (event: Event) => handleSignUpSubmit(event));

function showForm(formType: "login" | "signup"): void {
  const formElements = {
    loginForm: document.getElementById("login-form") as HTMLElement,
    signupForm: document.getElementById("signup-form") as HTMLElement,
    loginTab: document.getElementById("login-tab") as HTMLElement,
    signupTab: document.getElementById("signup-tab") as HTMLElement,
  };

  const isLogin = formType === "login";

  formElements.loginForm.classList.toggle("active", isLogin);
  formElements.signupForm.classList.toggle("active", !isLogin);
  formElements.loginTab.classList.toggle("active", isLogin);
  formElements.signupTab.classList.toggle("active", !isLogin);
}

// Login error function
const loginShowError = (message: string) => {
  const oldError = document.getElementById('login-error');
  if (oldError) oldError.remove();

  const errorMsg = document.createElement('div');
  errorMsg.id = 'login-error';
  errorMsg.style.color = 'red';
  errorMsg.style.marginTop = '10px';
  errorMsg.textContent = message;
  const form = document.getElementById('login-form');
  if (form) {
    form.appendChild(errorMsg);
  }
};

// Signup error function 
const signupShowError = (message: string) => {
  const oldError = document.getElementById('login-error');
  if (oldError) oldError.remove();

  const errorMsg = document.createElement('div');
  errorMsg.id = 'login-error';
  errorMsg.style.color = 'red';
  errorMsg.style.marginTop = '10px';
  errorMsg.textContent = message;
  const form = document.getElementById('signup-form');
  if (form) {
    form.appendChild(errorMsg);
  }
};

// Validation form
function validateForm(email: string, password: string, confirmPassword: string): { isValid: boolean, message?: string } {
  if (!email || !password || !confirmPassword) {
    return { isValid: false, message: "All fields are required!" };
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address." };
  }

  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long." };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match!" };
  }

  return { isValid: true };
}

function enableSubmitButton(button: HTMLButtonElement | null): void {
  if (button) {
    button.disabled = false;
  }
}

async function submitForm(data: { username: string, password: string }): Promise<any> {
  const response = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

async function handleResponse(result: any): Promise<void> {
  if (!result.ok) {
    signupShowError('Login failed: ' + (result.error ?? 'Invalid credentials'));

  }
  else {
    window.location.href = "/signup/information";
  }
}

// Define the structure for the login data
interface LoginData {
  username: string;
  password: string;
}
// Define the structure of the server's response
interface ServerResponse {
  message: string;
  user_id?: string;
  token?: string; // Optional, if you're using JWT or other tokens
  error?: string; // Optional, if there's an error
}

interface UserAut {
  username: string,
  password: string
}
 
// Handle the signup form submision 
async function handleSignUpSubmit(event: Event): Promise<void> {
  event.preventDefault();
  const form = event.target as HTMLFormElement;

  const email = (form.querySelector("#signup-email") as HTMLInputElement).value;
  const password = (form.querySelector("#signup-password") as HTMLInputElement).value;
  const confirmPassword = (form.querySelector("#confirm-password") as HTMLInputElement).value;

  // Validate form data
  const validationResult = validateForm(email, password, confirmPassword);
  if (!validationResult.isValid) {
    signupShowError("Signup failed: " + validationResult.message)
    return;
  }


  const data: UserAut = { username: email, password };

  try {
    const response: UserAut = await submitForm(data);
    localStorage.setItem('userData', JSON.stringify(response.username));

    handleResponse(response);
  } catch (error: any) {
    signupShowError('Login failed: ' + (error.error ?? 'Invalid credentials'));
  } finally {
    // Re-enable the submit button after the process is done
    const submitButton = form.querySelector("button[type='submit']") as HTMLButtonElement;
    enableSubmitButton(submitButton);
  }
}

// Handle the login form submission
document.getElementById('login')?.addEventListener('submit', async (event: Event) => {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Collect form data
  const username = (document.getElementById('login-email') as HTMLInputElement).value;
  const password = (document.getElementById('login-password') as HTMLInputElement).value;

  const loginData: LoginData = { username, password };

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData), // Assume loginData: { email: string; password: string }
    });

    const data: ServerResponse = await response.json();

    if (response.ok) {
      if (data.user_id) {
        localStorage.setItem('user_id', data.user_id);
      }
      window.location.href = '/socket/v1';
    } else {
      loginShowError('Login failed: ' + (data.error ?? 'Invalid credentials'));
    }
  } catch (error) {
    loginShowError('An error occurred. Please try again.');
  }

});
