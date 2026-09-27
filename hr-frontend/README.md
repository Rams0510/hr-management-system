# Employee & HR Management System

A full-stack Employee and Human Resource Management System built with **Spring Boot, Spring Security, JWT, MySQL, and React**.

The system provides separate dashboards for HR/Managers and Employees, allowing organizations to manage employees, leaves, payroll, authentication, and employee information through a web-based application.

---

## 📌 Project Overview

The Employee & HR Management System is designed to simplify common HR operations through a centralized application.

### HR / Manager can:

- Manage employees
- Add new employees
- Edit employee details
- Delete employees
- Search employees by ID
- View employee details
- View employee leave history
- View employee payroll history
- Approve leave requests
- Reject leave requests
- Generate employee payroll

### Employees can:

- Login securely
- View their dashboard
- Apply for leave
- View leave history
- View payroll history
- Logout securely

---

## 🚀 Features

### Authentication & Security

- JWT-based authentication
- Spring Security
- Role-based authorization
- Protected frontend routes
- Secure API access
- Employee and HR/Manager role separation

### Employee Management

- Create employee
- View employees
- View employee by ID
- Update employee
- Delete employee

### Leave Management

- Apply for leave
- View pending leave requests
- View employee leave history
- Approve leave requests
- Reject leave requests
- Leave balance tracking

### Payroll Management

- Generate payroll
- Calculate deductions for approved unpaid leave
- Calculate net salary
- View employee payroll history

### Frontend

- React-based user interface
- Responsive dashboard
- Separate Employee and HR dashboards
- Protected routes
- Axios API integration
- Login and logout functionality
- Interactive dashboard cards

---

# 🛠️ Technology Stack

## Backend

- Java 21
- Spring Boot 3.5.16
- Spring Security
- Spring Data JPA
- JWT
- Maven
- MySQL 8

## Frontend

- React
- Vite
- JavaScript
- Axios
- React Router DOM
- CSS

## Development Tools

- IntelliJ IDEA
- MySQL Workbench
- Git
- GitHub

---

# 📂 Project Structure

```text
hr-management-system/
│
├── src/
│   ├── main/
│   │   ├── java/com/hrms/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   ├── service/
│   │   │   └── HrSystemApplication.java
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│
├── hr-frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

---

# ✅ Prerequisites

Before running the project, install:

- Java 21 or later
- Maven
- MySQL 8
- Node.js
- npm
- Git

Check your installed versions:

```bash
java -version
mvn -version
mysql --version
node -v
npm -v
git --version
```

---

# 🗄️ Database Setup

The application uses MySQL.

## 1. Start MySQL

Make sure your MySQL server is running.

## 2. Create the database

Open MySQL Workbench or MySQL command line and run:

```sql
CREATE DATABASE hr_management;
```

The application will create/update the required tables automatically because Hibernate is configured with:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

# 🔐 Backend Configuration

The backend intentionally does **not** store the database password or JWT secret directly in the GitHub repository.

The file:

```text
src/main/resources/application.properties
```

uses environment variables:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hr_management
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:86400000}
```

---

# 🔑 Environment Variables

Before starting the backend, configure these environment variables:

```text
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION
```

Example:

```text
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRATION=86400000
```

### Important

Do not commit your actual password or secret to GitHub.

For IntelliJ IDEA:

1. Open **Run**
2. Select **Edit Configurations**
3. Select `HrSystemApplication`
4. Find **Environment variables**
5. Add the variables above
6. Click **Apply**
7. Click **OK**

---

# ▶️ Running the Backend

From the project root:

```bash
cd hr-management-system
```

Run the Spring Boot application using Maven:

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

Or run:

```text
HrSystemApplication.java
```

directly from IntelliJ IDEA.

The backend runs on:

```text
http://localhost:8080
```

---

# 💻 Running the Frontend

Open another terminal.

Navigate to the frontend:

```bash
cd hr-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔗 Backend API

The backend base URL is:

```text
http://localhost:8080/api
```

## Authentication

```text
POST /api/auth/login
```

## Employees

```text
GET    /api/employees
GET    /api/employees/{id}
POST   /api/employees
PUT    /api/employees/{id}
DELETE /api/employees/{id}
```

## Leave

```text
POST /api/leaves/apply
GET  /api/leaves/pending
GET  /api/leaves/employee/{id}

PUT /api/leaves/approve/{id}
PUT /api/leaves/reject/{id}
```

## Payroll

```text
POST /api/payroll/generate
GET  /api/payroll/employee/{id}
```

Most protected endpoints require a valid JWT token.

---

# 👥 User Roles

The application supports role-based access.

### Employee

Employees can:

- Apply for leave
- View their leave history
- View their payroll history

### HR / Manager

HR and Managers can access HR-related functionality such as:

- Employee management
- Leave approval/rejection
- Employee lookup
- Payroll generation
- Employee leave history
- Employee payroll history

---

# 🔄 Application Flow

```text
                    ┌─────────────────┐
                    │     Login       │
                    └────────┬────────┘
                             │
                       JWT Authentication
                             │
              ┌──────────────┴──────────────┐
              │                             │
        Employee Role                 HR / Manager Role
              │                             │
              ▼                             ▼
    Employee Dashboard             HR Dashboard
              │                             │
       ┌──────┼──────┐              ┌──────┼─────────┐
       │      │      │              │      │         │
     Leave  Payroll History       Employees Leave   Payroll
       │      │      │              │      │         │
       └──────┴──────┘              └──────┴─────────┘
              │                             │
              └────────── Backend ──────────┘
                            │
                       Spring Boot
                            │
                       Spring Security
                            │
                           JPA
                            │
                          MySQL
```

---

# 🔒 Security

The application uses:

- Spring Security
- JWT authentication
- Password-based login
- Role-based authorization
- Protected REST APIs
- Protected React routes
- Environment variables for sensitive configuration

Sensitive configuration such as database passwords and JWT secrets should never be committed to GitHub.

---

# 🧪 Testing

The project contains a Spring Boot test structure under:

```text
src/test/
```

Backend APIs can also be tested using tools such as:

- IntelliJ HTTP Client
- Postman
- Browser for GET endpoints where applicable

---

# 📦 GitHub Setup

Clone the project:

```bash
git clone https://github.com/Rams0510/hr-management-system.git
```

Navigate into the project:

```bash
cd hr-management-system
```

Then configure the required environment variables before running the backend.

For the frontend:

```bash
cd hr-frontend
npm install
npm run dev
```

---

# ⚠️ Important Notes

- MySQL must be running before starting the backend.
- The database `hr_management` must exist.
- The required environment variables must be configured.
- Backend runs on port `8080`.
- Frontend runs on port `5173` by default.
- Do not commit `.env` files, passwords, or private secrets.
- `node_modules` and Maven `target` directories are intentionally excluded from Git.

---

# 🔮 Future Improvements

Possible future enhancements include:

- Dashboard statistics
- Department management UI
- Advanced employee search
- Pagination
- Attendance management
- Email notifications
- Improved payroll calculations
- PDF payroll generation
- Employee profile management
- Admin user management
- Production deployment
- Cloud database integration

---

# 👨‍💻 Author

**Ramya**

GitHub:

https://github.com/Rams0510

Project:

https://github.com/Rams0510/hr-management-system

---

# 📄 License

This project is intended for educational and project-development purposes.