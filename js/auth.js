import {getUsers} from "./storage.js";
export function loginUser(emailorUsername, password,elements){
    const users = getUsers();
    const  user =users.find(function(users){
        return (users.email === emailorUsername || users.username === emailorUsername);  
    }) 

    if(!user){
            elements.loginError.textContent = "invalid email or username/password";
            return fasle;
    }
    if(user.password !== password){
        elements.loginError.textContent = "invalid email or username/password";
        return false;
    }
    const currentUser = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
    }

    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    sessionStorage.setItem("isAuthenticated", "true");

    elements.successMessage.textContent = "Login successful";
    return true;    
}           