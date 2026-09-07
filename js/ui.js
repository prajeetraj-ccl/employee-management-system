// import {getusers} from "./storage.js";
// export function loginUser(emailorUsername, password,elements){
//     const users = getUsers();
//     const  user =users.find(function(users){
//         return (users.email === emailorUsername || users.username === emailorUsername);  
//     }) 

//     if(!user){
//             elements.loginError.textContent = "invalid email or username/password";
//             return fasle;
//     }
//     if(user.password !== password){
//         elements.loginError.textContent = "invalid email or username/password";
//         return false;
//     }
//     const currentUser = {
//         id: user.id,
//         name: user.name,
//         username: user.username,
//         email: user.email,
//         role: user.role
//     }

//     sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
//     sessionStorage.setItem("isAuthenticated", "true");

//     elements.successMessage.textContent = "Login successful";
//     return true;    
// }           
export function createLoginPage(onLogin){
    const body = document.body;
    body.textContent = "";
    const container = document.createElement("div");
    container.classList.add("Login-container");
    const card = document.createElement("div");
    card.classList.add("login-card");
    const title = document.createElement("h1");
    title.textContent = "Employee Management System";
    title.classList.add("login-title");

    const emailGroup = document.createElement("div");
    emailGroup.classList.add("form-group");
    const emailLable = document.createElement("label");
    emailLable.textContent = "Email / Username";
    emailLable.classList.add("form-label");
    const emailInput = document.createElement("input");
    emailInput.type = "text";
    emailInput.classList.add("form-input");

    const emailError = document.createElement("span");
    emailError.classList.add("error-message");
    emailGroup.append(emailLable, emailInput, emailError);

    const passwordGroup = document.createElement("div");
    passwordGroup.classList.add("form-group");
    const passwordLable = document.createElement("label");
    passwordLable.classList.add("form-label");
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "Enter your password";
    passwordInput.classList.add("form-input");
    const passwordError = document.createElement("span");
    passwordError.classList.add("error-message");
    passwordGroup.append(passwordLable, passwordInput, passwordError);

    const loginButton = document.createElement("button");
    loginButton.type = "button";
    loginButton.textContent = "Login";
    loginButton.classList.add("login-button");

    const loginError = document.createElement("div");
    loginError.classList.add("error-message");

    const successMessage = document.createElement("div");
    successMessage.classList.add("success-message");

    card.append( title, emailGroup, passwordGroup, loginButton, loginError, successMessage);
    container.append(card);
    body.append(container);

    loginButton.addEventListener("click",function(){
            emailError.textContent = "";
            passwordError.textContent = ""; 
            loginError.textContent = "";
            successMessage.textContent = "";
            const emailorUsernae = emailInput.value.trim(); 
            const password = passwordInput.value;   

            let isValid = true; 
            if(emailorUsernae === ""){
                emailError.textContent = "Email or Username is required";
                isValid = false;    
            }

            if(password === ""){
                passwordError.textContent = "Password is required";
                isValid = false;    
            }
            if  (!isValid){
                return;    
            }   
            onLogin(
                emailorUsernae, password,
                {
                    emailError,
                    passwordError,  
                    successMessage,
                }   
            );
    });

};