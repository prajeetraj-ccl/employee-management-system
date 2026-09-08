import { createLoginPage } from "./ui.js";
import { loginUser } from "./auth.js";
import {getCurrentUser} from "./authorization.js";
import {initializeUsers,initializeEmployees,getEmployees} from "./storage.js";
import {showEmployees} from "./employee.js";

initializeUsers();
initializeEmployees();

function checkAuthentication() {
  const isAuthenticated =sessionStorage.getItem("isAuthenticated");
  if (isAuthenticated === "true") {
    showDashboard();
  } else {
    showLogin();
  }
}

function showLogin() {
  createLoginPage(function (emailOrUsername,password,elements) {
    const success =loginUser(emailOrUsername,password,elements);
    if (success) {
      setTimeout(function () {
        showDashboard();
      }, 500);
    }
  });
}

function logout() {
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("isAuthenticated");
  showLogin();
}

function createAppLayout() {
  const currentUser =getCurrentUser();
  if (currentUser === null) {
    showLogin();
    return null;
  }
  document.body.textContent = "";

  const appLayout =document.createElement("div");
  appLayout.classList.add("app-layout");
  const header =document.createElement("header");
  header.classList.add("app-header");
  const appTitle = document.createElement("h2");
  appTitle.textContent ="Employee Management";
  appTitle.classList.add("app-title");
  const headerUser =document.createElement("div");
  headerUser.classList.add("header-user");

  const userName = document.createElement("span");
  userName.textContent = currentUser.name;
  userName.classList.add("user-name");
  const userRole = document.createElement("span");
  userRole.textContent =currentUser.role;
  userRole.classList.add("user-role");
  const logoutButton =document.createElement("button");
  logoutButton.textContent ="Logout";
  logoutButton.classList.add("logout-button");
  logoutButton.addEventListener("click",function () { 
    logout();
    }
  );
  headerUser.append(userName,userRole,logoutButton);
  header.append( appTitle, headerUser);

  const bodyLayout =document.createElement("div");
  bodyLayout.style.display = "flex";
  bodyLayout.style.flex = "1";

  const sidebar = document.createElement("aside");
  sidebar.classList.add("sidebar");
  const sidebarMenu =document.createElement("div");
  sidebarMenu.classList.add("sidebar-menu");
  const dashboardButton = document.createElement("button");
  dashboardButton.textContent ="Dashboard";
  dashboardButton.classList.add("sidebar-button");
  dashboardButton.addEventListener("click",function () {
      showDashboard();
    }
  );
  const employeesButton = document.createElement("button");
  employeesButton.textContent = "Employees";
  employeesButton.classList.add("sidebar-button");
  employeesButton.addEventListener( "click", function () {
      showEmployees(createAppLayout, showDashboard);
    }
  );

  const profileButton = document.createElement("button");
  profileButton.textContent = "Profile";
  profileButton.classList.add( "sidebar-button");
  profileButton.addEventListener( "click",function () {
      showProfile();
    }
  );

  sidebarMenu.append(dashboardButton,employeesButton,profileButton);
  sidebar.append(sidebarMenu);

  const mainContent =document.createElement("main");
  mainContent.classList.add( "main-content"
  );

  bodyLayout.append(sidebar,mainContent);
  appLayout.append(header,bodyLayout);
  document.body.append(appLayout);

  return {
    mainContent,
    dashboardButton,
    employeesButton,
    profileButton
  };
}

function showDashboard() {
  const layout =createAppLayout();
  if (layout === null) {
    return;
  }
  layout.dashboardButton.classList.add("active");
  const mainContent =layout.mainContent;
  mainContent.textContent = "";
  const dashboard =document.createElement("div");
  dashboard.classList.add("dashboard");
  const title =document.createElement("h1");
  title.textContent ="Dashboard";
  const userText = document.createElement("p");
  const currentUser =getCurrentUser();
  userText.textContent =`Welcome, ${currentUser.name}`;
  const summaryContainer =document.createElement("div");
  summaryContainer.classList.add("summary-container");
  const employees = getEmployees();
  const totalCard =createSummaryCard("Employees",employees.length);
  const activeEmployees =employees.filter(function (employee) {
      return employee.status === "Active";
    });

  const activeCard = createSummaryCard("Active",activeEmployees.length);
  const inactiveEmployees =employees.filter(function (employee) {
      return employee.status === "Inactive";
    });

  const inactiveCard =createSummaryCard("Inactive",inactiveEmployees.length );
  summaryContainer.append(totalCard,activeCard,inactiveCard);
  const recentSection =document.createElement("div");
  recentSection.classList.add("recent-section");
  const recentTitle =document.createElement("h2");
  recentTitle.textContent =" Employees";
  const recentCard = document.createElement("div");
  recentCard.classList.add("recent-card");
  const recentTable =document.createElement("table");
  recentTable.classList.add("employee-table");

  const recentHead =document.createElement("thead");
  const recentHeaderRow =document.createElement("tr");
  const headers = [
    "ID",
    "Name",
    "Department",
    "Status"
  ];

  headers.forEach(function (headerName) {
    const th =document.createElement("th");
    th.textContent =headerName;
    recentHeaderRow.append(th);
  });
  recentHead.append( recentHeaderRow
  );

  const recentBody =document.createElement("tbody");
  employees
    .slice(0, 5)
    .forEach(function (employee) {
      const row =document.createElement("tr");
      const id = document.createElement("td");
      id.textContent =employee.id;
      const name =document.createElement("td");
      name.textContent =employee.name;
      const department = document.createElement("td");
      department.textContent = employee.department;
      const statusCell = document.createElement("td");
      const status =document.createElement("span");
      status.textContent =employee.status;
      status.classList.add("status-badge");
      if (employee.status === "Active") {
        status.classList.add("status-active" );
      } else {
        status.classList.add("status-inactive");
      }
      statusCell.append(status);
      row.append(id,name,department,statusCell);
      recentBody.append(row);
    });

  recentTable.append(recentHead,recentBody);
  recentCard.append(recentTable);
  recentSection.append(recentTitle,recentCard);
  dashboard.append(title,userText,summaryContainer,recentSection);
  mainContent.append(dashboard
  );
}

function createSummaryCard(titleText,value
) {
  const card =document.createElement("div");
  card.classList.add("summary-card");
  const title =document.createElement("p");
  title.textContent =titleText;
  title.classList.add("summary-card-title");
  const number =document.createElement("div");
  number.textContent =value;
  number.classList.add("summary-card-value");
  card.append(title,number);
  return card;
}

function showProfile() {
  const layout =createAppLayout();
  if (layout === null) {
    return;
  }
  layout.profileButton.classList.add("active" );
  const mainContent =layout.mainContent;
  mainContent.textContent = "";
  const currentUser = getCurrentUser();
  const profile =document.createElement("div");
  profile.classList.add("employee-form");
  const title =document.createElement("h1");
  title.textContent ="Profile";
  const name =document.createElement("p");
  name.textContent =`Name: ${currentUser.name}`;
  const email =document.createElement("p");
  email.textContent =`Email: ${currentUser.email}`;
  const role =document.createElement("p");
  role.textContent =`Role: ${currentUser.role}`;
  profile.append(title,name,email,role);
  mainContent.append( profile);
}

checkAuthentication();
