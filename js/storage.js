const USERS_KEY = "users";
const EMPLOYEES_KEY = "employees";
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

export function initializeEmployees(){
    const exisitngEmployees = localStorage.getItem(EMPLOYEES_KEY);
    if(exisitngEmployees === null){
        const employees = [
            {
                id: "EMP001",
                name:"Barani Kumar",
                email: "barani@gmail.com",
                phone: "9900887766",
                department: "IT",
                designation: "Developer",
                salary:45000,
                joiningDate: "2023-08-23",
                status: "Active",
                userId: 3
            },
             {
                id: "EMP002",
                name:"Santhosh",
                email: "santhosh@gmail.com",
                phone: "9900887755",
                department: "HR",
                designation: "HR Executive",
                salary:41000,
                joiningDate: "2024-08-23",
                status: "Active",
                userId: null
            },
             {
                id: "EMP003",
                name:"Vicky",
                email: "vicky@gmail.com",
                phone: "9900887766",
                department: "devop",
                designation: "Devops",
                salary:4000,
                joiningDate: "2023-08-23",
                status: "INACTIVE",
                userId: null
            },
        ];
        localStorage.setItem(EMPLOYEES_KEY,JSON.stringify(employees));
    }
}


export function getEmployees(){
    const employees = localStorage.getItem(EMPLOYEES_KEY);
    if(employees === null){
        return [];
    }
    return JSON.parse(employees);
}

export function saveEmployees(employees){
    localStorage.setItem(EMPLOYEES_KEY,JSON.stringify(employees));
}


