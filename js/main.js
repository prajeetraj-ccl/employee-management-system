import { createLoginPage } from "./ui.js";
import { loginUser } from "./auth.js";
import {
getCurrentUser,
canAddEmployee,
canEditEmployee,
canDeleteEmployee,
canViewEmployeeDetails
} from "./authorization.js";
import {
initializeUsers,
initializeEmployees,
getEmployees
} from "./storage.js";

initializeUsers();
initializeEmployees()

function checkAuthentication() {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");
  if (isAuthenticated === "true") {
    showDashboard();
  } else {
    showLogin();
  }
};

function showLogin() {
  createLoginPage(function (emailOrUsername, password, elements) {
    const success = loginUser(emailOrUsername, password, elements);
    if (success) {
      setTimeout(function () {
        showDashboard();
      }, 500);
    }
  });
}

function showDashboard() {
  const currentUser = getCurrentUser();
  if (currentUser === null) {
    showLogin();
    return;
  }
  document.body.textContent = "";
  const dashboard = document.createElement("div");
  dashboard.classList.add("dashboard");
  const title = document.createElement("h1");
  title.textContent = "Dashboard";
  const userText = document.createElement("p");
  const role = getCurrentUser();
  userText.textContent = `Welcome, ${currentUser.name} `;
  const employeeButton = document.createElement("button");
  employeeButton.textContent = "Employees";
  employeeButton.classList.add("logout-button");
  employeeButton.addEventListener("click", function () {
    showEmployees();
  });


  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutButton.classList.add("logout-button");
  logoutButton.addEventListener("click", function () {
    logout();
  });
  dashboard.append(title, userText, employeeButton, logoutButton);
  document.body.append(dashboard);
}


function showEmployees() {
  const currentUser = getCurrentUser();
  if (currentUser === null) {
    showLogin();
    return;
  }
  document.body.textContent = "";
  const appLayout = document.createElement("div");
  appLayout.classList.add("app-layout");
  const header = document.createElement("header");
  header.classList.add("app-header");
  const appTitle = document.createElement("h2");
  appTitle.textContent = "CCL Billz";
  appTitle.classList.add("app-title");
  const headerUser = document.createElement("div");
  headerUser.classList.add("header-user");
  const userName = document.createElement("span");
  userName.textContent = currentUser.name;
  userName.classList.add("user-name");
  const userRole = document.createElement("span");
  userRole.textContent = currentUser.role;
  userRole.classList.add("user-role");
  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutButton.classList.add("logout-button");
  logoutButton.addEventListener("click", function () {
    logout();
  });
  headerUser.append(userName,userRole,logoutButton
  );
  header.append( appTitle, headerUser)

  const bodyLayout = document.createElement("div");
  bodyLayout.style.display = "flex";
  bodyLayout.style.flex = "1";

  const sidebar = document.createElement("aside");
  sidebar.classList.add("sidebar");
  const sidebarMenu = document.createElement("div");
  sidebarMenu.classList.add("sidebar-menu");

  const dashboardButton = document.createElement("button");
  dashboardButton.textContent = "Dashboard";
  dashboardButton.classList.add("sidebar-button");
  dashboardButton.addEventListener("click", function () {
    showDashboard();
  });

  const employeesButton = document.createElement("button");
  employeesButton.textContent = "Employees";
  employeesButton.classList.add(
    "sidebar-button",
    "active"
  );
  const profileButton = document.createElement("button");
  profileButton.textContent = "Profile";
  profileButton.classList.add("sidebar-button");
  sidebarMenu.append(dashboardButton,employeesButton,profileButton);
  sidebar.append(sidebarMenu);
  const mainContent = document.createElement("main");
  mainContent.classList.add("main-content");

  const page = document.createElement("div");
  page.classList.add("employee-page");
  const employeeHeader = document.createElement("div");
  employeeHeader.classList.add("employee-header");
  const title = document.createElement("h1");
  title.textContent = "Employees";
  if (canAddEmployee()) {
    const addButton = document.createElement("button");
    addButton.textContent = "+ Add Employee";
    addButton.classList.add(
      "action-button",
      "btn-primary"
    );
    addButton.addEventListener("click", function () {
      if (!canAddEmployee()) {
        alert(
          "You are not authorized to add employees."
        );
        return;
      }
      alert(
        "Add Employee screen will be created next."
      );
    });
    employeeHeader.append(addButton);
  }
  employeeHeader.prepend(title);
  const controls = document.createElement("div");
  controls.classList.add("employee-controls");

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search employee...";
  searchInput.classList.add("search-input");

  const departmentSelect = document.createElement("select");
  departmentSelect.classList.add("filter-select");
  const departmentDefault = document.createElement("option");
  departmentDefault.value = "";
  departmentDefault.textContent = "Department";
  departmentSelect.append(departmentDefault);
  const statusSelect = document.createElement("select");
  statusSelect.classList.add("filter-select");
  const statusDefault = document.createElement("option");
  statusDefault.value = "";
  statusDefault.textContent = "Status";
  const activeOption = document.createElement("option");
  activeOption.value = "Active";
  activeOption.textContent = "Active";
  const inactiveOption = document.createElement("option");
  inactiveOption.value = "Inactive";
  inactiveOption.textContent = "Inactive";
  statusSelect.append(statusDefault,activeOption,inactiveOption);
  controls.append(searchInput,departmentSelect,statusSelect);
  const table = document.createElement("table");
  table.classList.add("employee-table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = [
    "ID",
    "Name",
    "Email",
    "Department",
    "Status",
    "Actions"
  ];
  headers.forEach(function (headerName) {
    const th = document.createElement("th");
    th.textContent = headerName;
    headerRow.append(th);
  });
  thead.append(headerRow);
  const tbody = document.createElement("tbody");
  const employees = getEmployees();
  employees.forEach(function (employee) {
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
    const actionGroup = document.createElement("div");
    actionGroup.classList.add("action-group");
    if (canViewEmployeeDetails(employee)) {
      const viewButton = document.createElement("button");
      viewButton.textContent = "View";
      viewButton.classList.add(
        "action-button",
        "btn-secondary"
      );
      viewButton.addEventListener("click", function () {
        if (!canViewEmployeeDetails(employee)) {
          alert(
            "You are not authorized to view this employee."
          );
          return;
        }
        alert(
          "Employee: " +
          employee.name +
          "\nEmail: " +
          employee.email
        );
      });
      actionGroup.append(viewButton);
    }
    if (canEditEmployee()) {
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add(
        "action-button",
        "btn-primary"
      );
      editButton.addEventListener("click", function () {
        if (!canEditEmployee()) {
          alert(
            "You are not authorized to edit employees."
          );
          return;
        }
        alert(
          "Edit functionality will be created next."
        );
      });
      actionGroup.append(editButton);
    }

    if (canDeleteEmployee()) {
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add(
        "action-button",
        "btn-danger"
      );

      deleteButton.addEventListener("click", function () {
        if (!canDeleteEmployee()) {
          alert(
            "You are not authorized to delete employees."
          );
          return;
        }
        alert(
          "Delete functionality will be created next."
        );
      });
      actionGroup.append(deleteButton);
    }
    actionsCell.append(actionGroup);
    row.append(idCell,nameCell,emailCell,departmentCell,statusCell,actionsCell);
    tbody.append(row);
  });
  table.append( thead,tbody);
  searchInput.addEventListener("input", function () {
    const searchValue =
      searchInput.value.toLowerCase();
    const rows =
      tbody.querySelectorAll("tr");
    rows.forEach(function (row) {
      const rowText =
        row.textContent.toLowerCase();
      if (rowText.includes(searchValue)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });

  const pagination = document.createElement("div");
  pagination.classList.add("pagination");
  const pageNumbers = [
    "1",
    "2",
    "3",
    "Next"
  ];

  pageNumbers.forEach(function (pageNumber) {
    const pageButton =
      document.createElement("button");
    pageButton.textContent = pageNumber;
    pageButton.classList.add(
      "pagination-button"
    );
    pagination.append(pageButton);
  });
  page.append(employeeHeader,controls,table,pagination);
  mainContent.append(page);
  bodyLayout.append(sidebar,mainContent);
  appLayout.append(header,bodyLayout);
  document.body.append(appLayout);
}

function logout(){
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("isAuthenticated")
    showLogin();
}

checkAuthentication();
