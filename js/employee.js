import {
  getCurrentUser,
  canAddEmployee,
  canEditEmployee,
  canDeleteEmployee,
  canViewEmployeeDetails,
} from "./authorization.js";
import { getEmployees, saveEmployees } from "./storage.js";
import {showDashboard} from "./main.js"

export function showEmployees(createAppLayout, showDashboard) {
  const layout = createAppLayout();
  if (layout === null) {
    return;
  }
  const mainContent = layout.mainContent;
  const currentUser = getCurrentUser();
  if (currentUser === null) {
    return;
  }
  layout.employeesButton.classList.add("active");
  mainContent.textContent = "";

  const header = document.createElement("div");
  header.classList.add("employee-header");
  const title = document.createElement("h1");
  title.textContent = "Employees";
  header.append(title);

  const controls = document.createElement("div");
  controls.classList.add("employee-controls");

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search employee...";
  searchInput.classList.add("search-input");

  const departmentFilter = document.createElement("select");
  departmentFilter.classList.add("filter-select");
  const departmentDefault = document.createElement("option");
  departmentDefault.value = "";
  departmentDefault.textContent = "All Departments";
  const itOption = document.createElement("option");
  itOption.value = "IT";
  itOption.textContent = "IT";
  const hrOption = document.createElement("option");
  hrOption.value = "HR";
  hrOption.textContent = "HR";
  const financeOption = document.createElement("option");
  financeOption.value = "Finance";
  financeOption.textContent = "Finance";
  const salesOption = document.createElement("option");
  salesOption.value = "Sales";
  salesOption.textContent = "Sales";
  departmentFilter.append(departmentDefault,itOption,hrOption,financeOption,salesOption,);

  const statusFilter = document.createElement("select");
  statusFilter.classList.add("filter-select");
  const statusDefault = document.createElement("option");
  statusDefault.value = "";
  statusDefault.textContent = "All Status";
  const activeOption = document.createElement("option");
  activeOption.value = "Active";
  activeOption.textContent = "Active";
  const inactiveOption = document.createElement("option");
  inactiveOption.value = "Inactive";
  inactiveOption.textContent = "Inactive";
  statusFilter.append(statusDefault, activeOption, inactiveOption);

  if (canAddEmployee()) {
    const addButton = document.createElement("button");
    addButton.textContent = "Add Employee";
    addButton.classList.add("action-button", "btn-primary");
    addButton.addEventListener("click", function () {
      if (!canAddEmployee()) {
        alert("You are not authorized to add employees.");
        return;
      }
      showAddEmployee(createAppLayout, showEmployees);
    });
    controls.append(addButton);
  }
  controls.append(searchInput, departmentFilter, statusFilter);

  const table = document.createElement("table");
  table.classList.add("employee-table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const idHeader = document.createElement("th");
  idHeader.textContent = "Employee ID";
  const nameHeader = document.createElement("th");
  nameHeader.textContent = "Name";
  const emailHeader = document.createElement("th");
  emailHeader.textContent = "Email";
  const departmentHeader = document.createElement("th");
  departmentHeader.textContent = "Department";
  const statusHeader = document.createElement("th");
  statusHeader.textContent = "Status";
  const actionsHeader = document.createElement("th");
  actionsHeader.textContent = "Actions";
  headerRow.append(idHeader,nameHeader,emailHeader,departmentHeader,statusHeader,actionsHeader,);
  thead.append(headerRow);

  const tbody = document.createElement("tbody");
  function renderEmployees() {
    tbody.textContent = "";
    const employees = getEmployees();
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedDepartment = departmentFilter.value;
    const selectedStatus = statusFilter.value;
    employees.forEach(function (employee) {
      const matchesSearch =
        employee.id.toLowerCase().includes(searchValue) ||
        employee.name.toLowerCase().includes(searchValue) ||
        employee.email.toLowerCase().includes(searchValue);
      const matchesDepartment =selectedDepartment === "" || employee.department === selectedDepartment;
      const matchesStatus =selectedStatus === "" || employee.status === selectedStatus;
      if (!matchesSearch || !matchesDepartment || !matchesStatus) {
        return;
      }

      const row = document.createElement("tr");
      const idCell = document.createElement("td");
      idCell.textContent = employee.id;
      const nameCell = document.createElement("td");
      nameCell.textContent = employee.name;
      const emailCell = document.createElement("td");
      emailCell.textContent = employee.email;
      const departmentCell = document.createElement("td");
      departmentCell.textContent = employee.department;
      const statusCell = document.createElement("td");
      const status = document.createElement("span");
      status.textContent = employee.status;
      status.classList.add("status-badge");
      if (employee.status === "Active") {
        status.classList.add("status-active");
      } else {
        status.classList.add("status-inactive");
      }
      statusCell.append(status);
      const actionsCell = document.createElement("td");
      actionsCell.classList.add("action-group");
      if (canViewEmployeeDetails(employee)) {
        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.classList.add("action-button", "btn-secondary");
        viewButton.addEventListener("click", function () {
          if (!canViewEmployeeDetails(employee)) {
            alert("You are not authorized to view this employee.");
            return;
          }
          alert(
            "Employee Details\n\n" +
              "ID: " +
              employee.id +
              "\nName: " +
              employee.name +
              "\nEmail: " +
              employee.email +
              "\nPhone: " +
              employee.phone +
              "\nDepartment: " +
              employee.department +
              "\nDesignation: " +
              employee.designation +
              "\nSalary: " +
              employee.salary +
              "\nJoining Date: " +
              employee.joiningDate +
              "\nStatus: " +
              employee.status,
          );
        });
        actionsCell.append(viewButton);
      }

      if (canEditEmployee()) {
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("action-button", "btn-primary");
        editButton.addEventListener("click", function () {
          if (!canEditEmployee()) {
            alert("You are not authorized to edit employees.");
            return;
          }
         showEditEmployee(createAppLayout,showEmployees,employee);
        });
        actionsCell.append(editButton);
      }

      
if (canDeleteEmployee()) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("action-button", "btn-danger");
    deleteButton.addEventListener("click", function () {
        if (!canDeleteEmployee()) {
            alert("You are not authorized to delete employees.");
            return;
        }
        const confirmDelete = confirm(
            "Are you sure you want to delete " + employee.name + "?"
        );
        if (!confirmDelete) {
            return;
        }
        const employees = getEmployees();
        const updatedEmployees = employees.filter(function (item) {
            return item.id !== employee.id;
        });
        saveEmployees(updatedEmployees);
        alert("Employee deleted successfully.");
        showEmployees(createAppLayout, showDashboard);
    });
    actionsCell.append(deleteButton);
}

      row.append(idCell,nameCell,emailCell,departmentCell,statusCell,actionsCell,);
      tbody.append(row);
    });
  }
  table.append(thead, tbody);

  searchInput.addEventListener("input", renderEmployees);
  departmentFilter.addEventListener("change", renderEmployees);
  statusFilter.addEventListener("change", renderEmployees);

  const backButton = document.createElement("button");
  backButton.textContent = "Back to Dashboard";
  backButton.classList.add("action-button", "btn-secondary");
  backButton.addEventListener("click", function () {
    showDashboard();
  });
  mainContent.append(header, controls, table, backButton);
  renderEmployees();
}

export function showAddEmployee(createAppLayout, showEmployees) {
  const layout = createAppLayout();
  if (layout === null) {
    return;
  }
  if (!canAddEmployee()) {
    alert("You are not authorized to add employees.");

    return;
  }
  const mainContent = layout.mainContent;
  layout.employeesButton.classList.add("active");
  mainContent.textContent = "";
  const form = document.createElement("form");
  form.classList.add("employee-form");
  const title = document.createElement("h1");
  title.textContent = "Add Employee";
  const formGrid = document.createElement("div");
  formGrid.classList.add("employee-form-grid");
  const idGroup = createFormGroup("Employee ID", "employeeId", "text");
  const nameGroup = createFormGroup("Name", "employeeName", "text");
  const emailGroup = createFormGroup("Email", "employeeEmail", "email");
  const phoneGroup = createFormGroup("Phone", "employeePhone", "text");
  const departmentGroup = document.createElement("div");
  departmentGroup.classList.add("form-group");
  const departmentLabel = document.createElement("label");
  departmentLabel.textContent = "Department";
  departmentLabel.classList.add("form-label");
  const department = document.createElement("select");
  department.id = "employeeDepartment";
  department.classList.add("form-input");
  const departmentDefault = document.createElement("option");
  departmentDefault.value = "";
  departmentDefault.textContent = "Select Department";
  const itOption = document.createElement("option");
  itOption.value = "IT";
  itOption.textContent = "IT";
  const hrOption = document.createElement("option");
  hrOption.value = "HR";
  hrOption.textContent = "HR";
  const financeOption = document.createElement("option");
  financeOption.value = "Finance";
  financeOption.textContent = "Finance";
  const salesOption = document.createElement("option");
  salesOption.value = "Sales";
  salesOption.textContent = "Sales";
  department.append(departmentDefault,itOption,hrOption,financeOption,salesOption,);
  departmentGroup.append(departmentLabel, department);
  const designationGroup = createFormGroup("Designation","employeeDesignation","text", );
  const salaryGroup = createFormGroup("Salary", "employeeSalary", "number");
  const joiningDateGroup = createFormGroup("Joining Date","employeeJoiningDate","date",
  );
  const statusGroup = document.createElement("div");
  statusGroup.classList.add("form-group");
  const statusLabel = document.createElement("label");
  statusLabel.textContent = "Status";
  statusLabel.classList.add("form-label");
  const status = document.createElement("select");
  status.id = "employeeStatus";
  status.classList.add("form-input");
  const activeOption = document.createElement("option");
  activeOption.value = "Active";
  activeOption.textContent = "Active";
  const inactiveOption = document.createElement("option");
  inactiveOption.value = "Inactive";
  inactiveOption.textContent = "Inactive";
  status.append(activeOption, inactiveOption);
  statusGroup.append(statusLabel, status);
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error-message");
  const buttons = document.createElement("div");
  buttons.classList.add("form-buttons");
  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.textContent = "Save Employee";
  saveButton.classList.add("action-button", "btn-success");
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Back";
  cancelButton.classList.add("action-button", "btn-secondary");
  cancelButton.addEventListener("click", function () {
    showEmployees(createAppLayout, showDashboard);
  });
  buttons.append(saveButton, cancelButton);

  formGrid.append(idGroup,nameGroup,emailGroup,phoneGroup,departmentGroup,designationGroup,salaryGroup,joiningDateGroup,
  statusGroup
  );
  form.append(title,formGrid,errorMessage,buttons);
  mainContent.append(form);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    errorMessage.textContent = "";
    const employeeId = document.querySelector("#employeeId").value.trim();
    const employeeName = document.querySelector("#employeeName").value.trim();
    const employeeEmail = document.querySelector("#employeeEmail").value.trim();
    const employeePhone = document.querySelector("#employeePhone").value.trim();
    const employeeDepartment = document.querySelector("#employeeDepartment",).value;
    const employeeDesignation = document.querySelector("#employeeDesignation").value.trim();
    const employeeSalary = document.querySelector("#employeeSalary").value;
    const employeeJoiningDate = document.querySelector("#employeeJoiningDate",).value;
    const employeeStatus = document.querySelector("#employeeStatus").value;
    if (employeeId === "") {
      errorMessage.textContent = "Employee ID is required.";
      return;
    }
    if (employeeName === "") {
      errorMessage.textContent = "Name is required.";
      return;
    }
    if (employeeName.length < 3) {
      errorMessage.textContent = "Name must contain at least 3 characters.";
      return;
    }
    if (employeeEmail === "") {
      errorMessage.textContent = "Email is required.";
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(employeeEmail)) {
      errorMessage.textContent = "Please enter a valid email.";
      return;
    }
    if (employeePhone === "") {
      errorMessage.textContent = "Phone is required.";
      return;
    }
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(employeePhone)) {
      errorMessage.textContent = "Phone must contain exactly 10 digits.";
      return;
    }
    if (employeeDepartment === "") {
      errorMessage.textContent = "Department is required.";
      return;
    }
    if (employeeDesignation === "") {
      errorMessage.textContent = "Designation is required.";
      return;
    }
    if (employeeSalary === "") {
      errorMessage.textContent = "Salary is required.";
      return;
    }
    if (Number(employeeSalary) <= 0) {
      errorMessage.textContent = "Salary must be greater than 0.";
      return;
    }
    if (employeeJoiningDate === "") {
      errorMessage.textContent = "Joining date is required.";
      return;
    }
    const employees = getEmployees();
    const duplicateId = employees.some(function (employee) {
      return employee.id.toLowerCase() === employeeId.toLowerCase();
    });
    if (duplicateId) {
      errorMessage.textContent = "Employee ID already exists.";
      return;
    }
    const duplicateEmail = employees.some(function (employee) {
      return employee.email.toLowerCase() === employeeEmail.toLowerCase();
    });
    if (duplicateEmail) {
      errorMessage.textContent = "Email already exists.";
      return;
    }

    const newEmployee = {
      id: employeeId,
      name: employeeName,
      email: employeeEmail,
      phone: employeePhone,
      department: employeeDepartment,
      designation: employeeDesignation,
      salary: Number(employeeSalary),
      joiningDate: employeeJoiningDate,
      status: employeeStatus,
    };

    employees.push(newEmployee);
    saveEmployees(employees);
    form.reset();
    showEmployees(createAppLayout, showDashboard);
  });
}


export function showEditEmployee(createAppLayout,showEmployees,employee ){
    const layout = createAppLayout();
    if(layout === null){
        return;
    }
    if(!canEditEmployee()){
        alert("your not authorized to edit employee");
        return;
    }
    const mainContent = layout.mainContent;
    layout.employeesButton.classList.add("active");
    mainContent.textContent = "";
    const form = document.createElement("form");
    form.classList.add("employee-form");
    const title = document.createElement("h1");
    title.textContent = "Edit Employee";

    const idGroup = createFormGroup("Employee ID","employeeId","text");
    const nameGroup = createFormGroup("Name","employeeName","text");
    const emailGroup = createFormGroup("Email","employeeEmail","text");
    const phoneGroup = createFormGroup("Phone","employeePhone","text");
    const departmentGroup = document.createElement("div");
    departmentGroup.classList.add("form-group");
    const departmentLabel = document.createElement("label");
    departmentLabel.textContent = "Department";
    departmentLabel.classList.add("form-label");
    const department = document.createElement("select");
    department.id = "employeeDepartment";
    department.classList.add("form-input");
    const departments = ["IT", "HR", "Finance", "Sales"];
    departments.forEach(function (departmentName) {
        const option = document.createElement("option");
        option.value = departmentName;
        option.textContent = departmentName;
        department.append(option);
    });
    departmentGroup.append(departmentLabel, department); 
    const designationGroup = createFormGroup("Designation","employeeDesignation","text");
    const salaryGroup = createFormGroup("Salary","employeeSalary","number");
    const joiningDateGroup = createFormGroup("Joining Date","employeeJoiningDate","date");
    const statusGroup = document.createElement("div");
    statusGroup.classList.add("form-group");
    const statusLabel = document.createElement("label");
    statusLabel.textContent = "Status";
    statusLabel.classList.add("form-label");
    const status = document.createElement("select");
    status.id = "employeeStatus";
    status.classList.add("form-input");
    const activeOption = document.createElement("option");
    activeOption.value = "Active";
    activeOption.textContent = "Active";
    const inactiveOption = document.createElement("option");
    inactiveOption.value = "Inactive";
    inactiveOption.textContent = "Inactive";
    status.append(activeOption, inactiveOption); 
    statusGroup.append(statusLabel,status);

    const formGrid = document.createElement("div");
    formGrid.classList.add("employee-form-grid");
    formGrid.append(idGroup,nameGroup,emailGroup,phoneGroup,department,designationGroup,salaryGroup,
        joiningDateGroup,statusGroup);
    
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error-message");

    const buttons = document.createElement("div");
    buttons.classList.add("form-button");

    const updateButton = document.createElement("button");
    updateButton.type = "submit";
    updateButton.textContent = "Update Employee";
    updateButton.classList.add("action-button", "btn-success");

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.textContent = "Back";
    backButton.classList.add("action-button", "btn-secondary");
    backButton.addEventListener("click", function () {
        showEmployees(createAppLayout, function () {});
    });
    buttons.append(updateButton, backButton); 
    form.append(title,formGrid,errorMessage,buttons);
    mainContent.append(form);

    document.querySelector("#employeeId").value = employee.id;
    document.querySelector("#employeeName").value = employee.name;
    document.querySelector("#employeeEmail").value = employee.email;
    document.querySelector("#employeePhone").value = employee.phone;
    document.querySelector("#employeeDepartment").value = employee.department;
    document.querySelector("#employeeDesignation").value = employee.designation;
    document.querySelector("#employeeSalary").value = employee.salary;
    document.querySelector("#employeeJoiningDate").value = employee.joiningDate;
    document.querySelector("#employeeStatus").value = employee.status; 
    
    form.addEventListener("submit",function(event){
        event.preventDefault();
        errorMessage.textContent = "";
        const employeeId = document.querySelector("#employeeId").value.trim();
        const employeeName = document.querySelector("#employeeName").value.trim();
        const employeeEmail = document.querySelector("#employeeEmail").value.trim();
        const employeePhone = document.querySelector("#employeePhone").value.trim();
        const employeeDepartment = document.querySelector("#employeeDepartment").value;
        const employeeDesignation = document.querySelector("#employeeDesignation").value.trim();
        const employeeSalary = document.querySelector("#employeeSalary").value;
        const employeeJoiningDate = document.querySelector("#employeeJoiningDate").value;
        const employeeStatus = document.querySelector("#employeeStatus").value;

        if (employeeId === "") {
            errorMessage.textContent = "Employee ID is required.";
            return;
        }
        if (employeeName === "") {
            errorMessage.textContent = "Name is required.";
            return;
        }
        if (employeeName.length < 3) {
            errorMessage.textContent =
                "Name must contain at least 3 characters.";
            return;
        }
        if (employeeEmail === "") {
            errorMessage.textContent = "Email is required.";
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(employeeEmail)) {
            errorMessage.textContent = "Please enter a valid email.";
            return;
        }
        if (employeePhone === "") {
            errorMessage.textContent = "Phone is required.";
            return;
        }
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(employeePhone)) {
            errorMessage.textContent =
                "Phone must contain exactly 10 digits.";
            return;
        }
        if (employeeDepartment === "") {
            errorMessage.textContent = "Department is required.";
            return;
        }
        if (employeeDesignation === "") {
            errorMessage.textContent = "Designation is required.";
            return;
        }
        if (employeeSalary === "") {
            errorMessage.textContent = "Salary is required.";
            return;
        }
        if (Number(employeeSalary) <= 0) {
            errorMessage.textContent =
                "Salary must be greater than 0.";
            return;
        }
        if (employeeJoiningDate === "") {
            errorMessage.textContent =
                "Joining date is required.";
            return;
        } 

        const employees = getEmployees();

        const duplicateId = employees.some(function(item){
            return(
                item.id.toLowerCase() === employeeId.toLowerCase()&&
                item.id !== employeeId
            );
        });
            if(duplicateId){
                errorMessage.textContent = "Employee ID is Already Exist";
                return;
            }
        const duplicateEmail = employees.some(function (item) {
            return (
                item.email.toLowerCase() === employeeEmail.toLowerCase() &&
                item.id !== employee.id
        );
        });

        if (duplicateEmail) {
            errorMessage.textContent =
                "Email already exists.";
            return;
        }   

        const updatedEmployees = employees.map(function(item){
            if(item.id === employee.id){
                return{
                    id: employeeId,
                    name: employeeName,
                    email: employeeEmail,
                    phone:employeePhone,
                    department:employeeDepartment,
                    designation:employeeDesignation,
                    salary:Number(employeeSalary),
                    joiningDate:employeeJoiningDate,
                    status:employeeStatus
                };
            }
            return item;
        })
        
     saveEmployees(updatedEmployees);
     showEmployees(createAppLayout,function(){});
    });


};


function createFormGroup(labelText, inputId, inputType) {
  const group = document.createElement("div");
  group.classList.add("form-group");
  const label = document.createElement("label");
  label.textContent = labelText;
  label.classList.add("form-label");
  const input = document.createElement("input");
  input.type = inputType;
  input.id = inputId;
  input.classList.add("form-input");
  group.append(label, input);
  return group;
};


