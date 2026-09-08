export function createLoginPage(onLogin) {
  document.body.textContent = "";
  const container = document.createElement("div");
  container.classList.add("login-container");
  const card = document.createElement("div");
  card.classList.add("login-card");
  const title = document.createElement("h1");
  title.textContent = "Employee Management System";
  title.classList.add("login-title");
  const emailGroup = document.createElement("div");
  emailGroup.classList.add("form-group");
  const emailLabel = document.createElement("label");
  emailLabel.textContent = "Email / Username";
  emailLabel.classList.add("form-label");
  const emailInput = document.createElement("input");
  emailInput.type = "text";
  emailInput.placeholder = "Enter email or username";
  emailInput.classList.add("form-input");
  const emailError = document.createElement("span");
  emailError.classList.add("error-message");
  emailGroup.append(emailLabel, emailInput, emailError);
  const passwordGroup = document.createElement("div");
  passwordGroup.classList.add("form-group");
  const passwordLabel = document.createElement("label");
  passwordLabel.textContent = "Password";
  passwordLabel.classList.add("form-label");
  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.placeholder = "Enter password";
  passwordInput.classList.add("form-input");
  const passwordError = document.createElement("span");
  passwordError.classList.add("error-message");
  passwordGroup.append(passwordLabel, passwordInput, passwordError);

  const loginButton = document.createElement("button");
  loginButton.textContent = "Login";
  loginButton.classList.add("login-button");
  const loginError = document.createElement("span");
  loginError.classList.add("error-message");

  const successMessage = document.createElement("div");
  successMessage.classList.add("success-message");

  card.append(title,emailGroup,passwordGroup,loginButton,loginError,successMessage,);
  container.append(card);
  document.body.append(container);

  loginButton.addEventListener("click", function () {
    emailError.textContent = "";
    passwordError.textContent = "";
    loginError.textContent = "";
    successMessage.textContent = "";
    const emailOrUsername = emailInput.value.trim();
    const password = passwordInput.value;
    let isValid = true;
    if (emailOrUsername === "") {
      emailError.textContent = "Email or username is required.";
      isValid = false;
    }
    if (password === "") {
      passwordError.textContent = "Password is required.";
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    onLogin(emailOrUsername, password, {emailError,passwordError,loginError,successMessage});
  });
}


