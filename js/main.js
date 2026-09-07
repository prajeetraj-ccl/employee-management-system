const container = document.createElement("div");
container.classList.add("login-container");
document.body.append(container);

const title1 = document.createElement("h1");
title1.textContent = "Employee Management System";
title1.classList.add("title1");
container.append(title1);

const title = document.createElement("h2");
title.textContent = "Login";
title.classList.add("login-title");
container.append(title);

const emailGroup = document.createElement("div");
emailGroup.classList.add("form-group");
container.append(emailGroup);

const emailLabel = document.createElement("label");
emailLabel.textContent = "Email";
emailLabel.classList.add("form-label");
emailGroup.append(emailLabel);

const emailInput = document.createElement("input");
emailInput.type = "email";
emailInput.placeholder = "Enter your email";
emailInput.classList.add("input");
emailGroup.append(emailInput);

const emailError = document.createElement("p");
emailError.classList.add("error");
emailGroup.append(emailError);

const passwordGroup = document.createElement("div");
passwordGroup.classList.add("form-group");
container.append(passwordGroup);

const passwordLabel = document.createElement("div");
passwordLabel.textContent = "Password";
passwordLabel.classList.add("form-Label");
passwordGroup.append(passwordLabel);

const passwordInput = document.createElement("input");
passwordInput.type = "password";
passwordInput.placeholder = "Enter your password";
passwordInput.classList.add("input");
passwordGroup.append(passwordInput);

const passwordError = document.createElement("p");
passwordError.classList.add("error");
passwordGroup.append(passwordError);


const loginButton = document.createElement("button");
loginButton.textContent = "Login";
loginButton.classList.add("login-button");
container.append(loginButton);

const message = document.createElement("p");
message.classList.add("success");
container.append(message);

loginButton.addEventListener("click",function(){
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    emailError.textContent = "";
    passwordError.textContent = "";
    message.textContent = "";

    let isValid = true;

    if(email === ""){
        emailError.textContent = "Email is required";
        isValid = false;
    }else if(!email.includes("@")){
        emailError.textContent = "Please enter a valid email address";
        isValid = false;
    }

    if(password === ""){
        passwordError.textContent = "Password is required";
        isValid = false;
    }else if(password.length < 6){
        passwordError.textContent = "Password must be at least 6 characters long";
        isValid = false;
    }
    if(!isValid){
            return;
    }

    message.textContent = "Login successful";
    emailInput.value = "";
    passwordInput.value = "";
})