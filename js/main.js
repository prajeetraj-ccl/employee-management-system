import {initializeUsers} from "../js/storage.js";
import {createLoginPage} from "./ui.js";
import {loginUser} from "./auth.js";


initializeUsers();

function checkAuthentication() {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
        showDashboard();    
    }else {
        showLogin();
    }
}

function showLogin() {
    createLoginPage(function(emailorUsername, password, elements) {
        const success = loginUser(emailorUsername, password, elements);
        if (success) {
            setTimeout(function() {
                showDashboard();
            }, 500);
        }
    })
}

function showDashboard(){
    document.body.textContent="";
    const dashboard = document.createElement("div");
    dashboard.classList.add("dashboard");

    const title =document.createElement("h1");
    dashboard.textContent = "DasShboard";
    const userText = document.createElement("P");
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    userText.textContent = `Welcome,${currentUser.name}(${currentUser.role})`;

    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.addEventListener("click",function(){
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("isAuthenticated");
        showLogin();
    })
    dashboard.append(title,userText,logoutButton);
    document.body.append(dashboard);
}
checkAuthentication();