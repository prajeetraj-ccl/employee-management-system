export function getCurrentUser(){
    const user = sessionStorage.getItem("currentUser");
    if(user === null){
        return null;
    }
    return JSON.parse(user);
}

export function getCurrentUserRole(){
    const currentUser = getCurrentUser();
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

export function canDeleteEmployee(){
    return isAdmin();
}

export function canAddEmployee(){
    return isAdmin(); 
}

export function canEditEmployee(){
    return isAdmin();
}

export function canViewEmployees(){
    const role = getCurrentUserRole();
    return (role === "Admin" || role === "Manager" || role === "Employee")
}

export function canViewEmployeeDetails(employee){
    const currentUser = getCurrentUser();
    if(currentUser === null){
        return false;
    }

    if (currentUser.role === "Admin" || currentUser.role === "Manager"){
        return true;
    }

    if(currentUser.role === "Employee" && employee.userId === currentUser.id){
        return true;
    }
    return false;
}