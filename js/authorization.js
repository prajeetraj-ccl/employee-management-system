export function getCurrentUser(){
    const user = sessionStorage.getItem("currentUser");
    if(user === null){
        return null;
    }
    return JSON.parse(user);
}

export function getCurrentUserRole(){
    const currentUser = getCurrent();
    if(currentUser === null){
        return null;
    }
    return currentUser.role;
}

export function isAdmin(){
    const role = getCurrentUserRole();
    return role === "Admin";
}

export function isManager(){
    const role = getCurrentUserRole();
    return role === "Manager";
}

export function isEmployee(){
    const role = getCurrentUserRole();
    return role === "Employee";
}

export function canDeleteEmmployee(){
    return isAdmin();
}

export function canAddEmployee(){
    return isAdmin(); 
}

export function canEditEmployee(){
    return isAdmin();
}

export function canViewEmployee(){
    const role = getCurrentUserRole();
    return (role === "Admin" || role === "Manager" || role === "Employee")
}