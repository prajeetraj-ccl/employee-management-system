const USERS_KEY = "users";

export function initializeUsers(){
    const existingUsers = localStorage.getItem(USERS_KEY);
    if(existingUsers === null){
        const sampleUsers = [
            {
                id: 1,
                name: "Admin User",
                username: "Santhosh",
                email: "admin@example.com",
                password: "admin123",
                role: "Admin"
            },
            {
                id: 2,
                name: "Manager User",
                username: "Barani",
                email: "manager@example.com",
                password: "manager123",
                role: "Manager"
            },
            {
                id: 3,
                name: "Employee User",
                username: "Vicky",
                email: "employee@example.com",
                password: "employee123",
                role: "Employee"
            },
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(sampleUsers));
    }
}

export function getUsers(){
    const users = localStorage.getItem(USERS_KEY);
    if(users === null){
        return [];
    }
    return JSON.parse(users);
}