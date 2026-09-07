import { getEmployees, saveEmployees } from "./storage.js";

import {
  getCurrentUser,
  canAddEmployee,
  canEditEmployee,
  canDeleteEmployee,
  canViewEmployees,
  canViewEmployeeDetails,
} from "./authorization.js";

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

export function createDashboard(onLogout, onEmployees) {
  document.body.textContent = "";
  const currentUser = getCurrentUser();
  const dashboard = document.createElement("div");
  dashboard.classList.add("dashboard");
  const header = document.createElement("div");
  header.classList.add("dashboard-header");
  const title = document.createElement("h1");
  title.textContent = "Dashboard";
  const userInfo = document.createElement("div");
  userInfo.classList.add("user-info");
  userInfo.textContent = `Welcome, ${currentUser.name} | Role: ${currentUser.role}`;
  header.append(title, userInfo);
  const employeeButton = document.createElement("button");
  employeeButton.textContent = "Employees";
  employeeButton.classList.add("action-button");
  employeeButton.addEventListener("click", function () {
    if (!canViewEmployees()) {
      alert("You are not authorized to view employees.");
      return;
    }
    onEmployees();
  });

  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutButton.classList.add("logout-button");
  logoutButton.addEventListener("click", function () {
    onLogout();
  });

  dashboard.append(header, employeeButton, logoutButton);
  document.body.append(dashboard);
}


export function createEmployeePage(onBack, onAdd) {
  document.body.textContent = "";
  const currentUser = getCurrentUser();
  const employees = getEmployees();
  const page = document.createElement("div");
  page.classList.add("employee-page");
  const header = document.createElement("div");
  header.classList.add("employee-header");
  const title = document.createElement("h1");
  title.textContent = "Employees";
  const backButton = document.createElement("button");
  backButton.textContent = "Back to Dashboard";
  backButton.classList.add("action-button");
  backButton.addEventListener("click", function () {
    onBack();
  });

  header.append(title, backButton);
  page.append(header);

  const controls = document.createElement("div");
  controls.classList.add("employee-controls");

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search employee...";
  searchInput.classList.add("search-input");
  controls.append(searchInput);


  if (canAddEmployee()) {
    const addButton = document.createElement("button");
    addButton.textContent = "Add Employee";
    addButton.classList.add("action-button");
    addButton.addEventListener("click", function () {
      if (!canAddEmployee()) {
        alert("You are not authorized to add employees.");
        return;
      }
      onAdd();
    });
    controls.append(addButton);
  }
  page.append(controls);

  const tableContainer = document.createElement("div");
  page.append(tableContainer);
  function renderTable(employeeList) {
    tableContainer.textContent = "";
    if (employeeList.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.textContent = "No employees found.";
      emptyMessage.classList.add("empty-message");
      tableContainer.append(emptyMessage);
      return;
    }
    const table = document.createElement("table");
    table.classList.add("employee-table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = [
      "ID",
      "Name",
      "Email",
      "Department",
      "Designation",
      "Salary",
      "Status",
      "Actions",
    ];

    headers.forEach(function (headerText) {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.append(th);
    });

    thead.append(headerRow);
    table.append(thead);
    const tbody = document.createElement("tbody");
    employeeList.forEach(function (employee) {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = employee.id;
      const nameCell = document.createElement("td");
      nameCell.textContent = employee.name;
      const emailCell = document.createElement("td");
      emailCell.textContent = employee.email;
      const departmentCell = document.createElement("td");
      departmentCell.textContent = employee.department;
      const designationCell = document.createElement("td");
      designationCell.textContent = employee.designation;
      const salaryCell = document.createElement("td");
      salaryCell.textContent = `₹${employee.salary}`;
      const statusCell = document.createElement("td");
      statusCell.textContent = employee.status;
      if (employee.status === "Active") {
        statusCell.classList.add("status-active");
      } else {
        statusCell.classList.add("status-inactive");
      }

      const actionsCell = document.createElement("td");
      const actionGroup = document.createElement("div");
      actionGroup.classList.add("action-group");

      if (canViewEmployeeDetails(employee)) {
        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.classList.add("action-button");
        viewButton.addEventListener("click", function () {
          if (!canViewEmployeeDetails(employee)) {
            alert("You are not authorized to view this employee.");
            return;
          }
          showEmployeeDetails(employee);
        });

        actionGroup.append(viewButton);
      }

      if (canEditEmployee()) {
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("action-button");
        editButton.addEventListener("click", function () {
          if (!canEditEmployee()) {
            alert("You are not authorized to edit employees.");

            return;
          }
          showEditEmployeeForm(employee, function () {
            createEmployeePage(onBack, onAdd);
          });
        });

        actionGroup.append(editButton);
      }


      if (canDeleteEmployee()) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("action-button");
        deleteButton.addEventListener("click", function () {
          if (!canDeleteEmployee()) {
            alert("You are not authorized to delete employees.");
            return;
          }
          const confirmed = confirm(`Delete ${employee.name}?`);
          if (!confirmed) {
            return;
          }
          const latestEmployees = getEmployees();
          const updatedEmployees = latestEmployees.filter(function (item) {
            return item.id !== employee.id;
          });
          saveEmployees(updatedEmployees);
          alert("Employee deleted successfully.");
          createEmployeePage(onBack, onAdd);
        });
        actionGroup.append(deleteButton);
      }
      actionsCell.append(actionGroup);
      row.append(idCell,nameCell,emailCell,departmentCell,designationCell,salaryCell,statusCell,actionsCell);
      tbody.append(row);
    });

    table.append(tbody);
    tableContainer.append(table);
  }
  renderTable(employees);

  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.trim().toLowerCase();
    const latestEmployees = getEmployees();
    const filteredEmployees = latestEmployees.filter(function (employee) {
      return (
        employee.id.toLowerCase().includes(searchValue) ||
        employee.name.toLowerCase().includes(searchValue) ||
        employee.email.toLowerCase().includes(searchValue) ||
        employee.department.toLowerCase().includes(searchValue)
      );
    });
    renderTable(filteredEmployees);
  });

  document.body.append(page);
}


function showEmployeeDetails(employee) {
  if (!canViewEmployeeDetails(employee)) {
    alert("You are not authorized to view this employee.");
    return;
  }
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const title = document.createElement("h2");
  title.textContent = "Employee Details";
  title.classList.add("modal-title");
  const details = [
    ["Employee ID", employee.id],
    ["Name", employee.name],
    ["Email", employee.email],
    ["Phone", employee.phone],
    ["Department", employee.department],
    ["Designation", employee.designation],
    ["Salary", `₹${employee.salary}`],
    ["Joining Date", employee.joiningDate],
    ["Status", employee.status],
  ];

  details.forEach(function ([label, value]) {
    const row = document.createElement("div");
    row.classList.add("detail-row");
    const labelElement = document.createElement("span");
    labelElement.textContent = `${label}: `;
    labelElement.classList.add("detail-label");
    const valueElement = document.createElement("span");
    valueElement.textContent = value;
    row.append(labelElement, valueElement);
    modal.append(row);
  });

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.classList.add("action-button");
  closeButton.addEventListener("click", function () {
    overlay.remove();
  });
  modal.append(closeButton);
  overlay.append(modal);
  document.body.append(overlay);
}


export function createAddEmployeePage(onBack) {
  if (!canAddEmployee()) {
    alert("You are not authorized to add employees.");
    onBack();
    return;
  }

  createEmployeeForm("Add Employee", null, onBack);
}

function showEditEmployeeForm(employee, onSuccess) {
  if (!canEditEmployee()) {
    alert("You are not authorized to edit employees.");

    return;
  }
  createEmployeeForm("Edit Employee", employee, onSuccess);
}


function createEmployeeForm(titleText, employee, onSuccess) {
  document.body.textContent = "";
  const page = document.createElement("div");
  page.classList.add("employee-page");
  const title = document.createElement("h1");
  title.textContent = titleText;
  const form = document.createElement("form");
  form.classList.add("employee-form");


  function createField(labelText, type, value) {
    const group = document.createElement("div");
    group.classList.add("form-group");
    const label = document.createElement("label");
    label.textContent = labelText;
    label.classList.add("form-label");
    const input = document.createElement("input");
    input.type = type;
    input.value = value || "";
    input.classList.add("form-input");
    const error = document.createElement("span");
    error.classList.add("error-message");
    group.append(label, input, error);
    form.append(group);
    return {input,error,};
  }

  const idField = createField("Employee ID", "text", employee?.id);
  const nameField = createField("Name", "text", employee?.name);
  const emailField = createField("Email", "email", employee?.email);
  const phoneField = createField("Phone", "text", employee?.phone);
  const departmentField = createField(
    "Department",
    "text",
    employee?.department,
  );
  const designationField = createField(
    "Designation",
    "text",
    employee?.designation,
  );
  const salaryField = createField("Salary", "number", employee?.salary);
  const joiningDateField = createField(
    "Joining Date",
    "date",
    employee?.joiningDate,
  );
  const statusField = createField(
    "Status",
    "text",
    employee?.status || "Active",
  );
  const buttons = document.createElement("div");
  buttons.classList.add("form-buttons");
  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.textContent = employee ? "Update" : "Save";
  saveButton.classList.add("action-button");
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("action-button");
  cancelButton.addEventListener("click", function () {
    onSuccess();
  });

  buttons.append(saveButton, cancelButton);
  form.append(buttons);
  page.append(title, form);
  document.body.append(page);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (employee && !canEditEmployee()) {
      alert("You are not authorized to edit employees.");
      return;
    }
    if (!employee && !canAddEmployee()) {
      alert("You are not authorized to add employees.");

      return;
    }
    const id = idField.input.value.trim();
    const name = nameField.input.value.trim();
    const email = emailField.input.value.trim();
    const phone = phoneField.input.value.trim();
    const department = departmentField.input.value.trim();
    const designation = designationField.input.value.trim();
    const salary = Number(salaryField.input.value);
    const joiningDate = joiningDateField.input.value;
    const status = statusField.input.value.trim();
    let isValid = true;
    if (id === "") {
      idField.error.textContent = "Employee ID is required.";
      isValid = false;
    }
    if (name === "") {
      nameField.error.textContent = "Name is required.";
      isValid = false;
    }
    if (name.length < 3) {
      nameField.error.textContent = "Name must contain at least 3 characters.";
      isValid = false;
    }
    if (email === "") {
      emailField.error.textContent = "Email is required.";
      isValid = false;
    }
    if (phone === "") {
      phoneField.error.textContent = "Phone is required.";
      isValid = false;
    }
    if (!/^\d{10}$/.test(phone)) {
      phoneField.error.textContent = "Phone must contain 10 digits.";
      isValid = false;
    }
    if (department === "") {
      departmentField.error.textContent = "Department is required.";
      isValid = false;
    }

    if (designation === "") {
      designationField.error.textContent = "Designation is required.";
      isValid = false;
    }

    if (salary <= 0) {
      salaryField.error.textContent = "Salary must be greater than 0.";
      isValid = false;
    }

    if (joiningDate === "") {
      joiningDateField.error.textContent = "Joining date is required.";
      isValid = false;
    }
    if (!isValid) {
      return;
    }

    const employees = getEmployees();
    const duplicateId = employees.some(function (item) {
      return item.id === id && item.id !== employee?.id;
    });
    if (duplicateId) {
      idField.error.textContent = "Employee ID already exists.";

      return;
    }
    const duplicateEmail = employees.some(function (item) {
      return item.email === email && item.id !== employee?.id;
    });
    if (duplicateEmail) {
      emailField.error.textContent = "Email already exists.";
      return;
    }
    const employeeData = {
      id,
      name,
      email,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      status,
      userId: employee?.userId || null,
    };

    if (employee) {
      const updatedEmployees = employees.map(function (item) {
        if (item.id === employee.id) {
          return employeeData;
        }
        return item;
      });
      saveEmployees(updatedEmployees);
      alert("Employee updated successfully.");
    } else {
      employees.push(employeeData);
      saveEmployees(employees);
      alert("Employee added successfully.");
    }
    onSuccess();
  });
}
