# Propvivo HRMS - Project Walkthrough & Setup Guide

Welcome to the **Propvivo HRMS** project! This document is designed to give you a complete, easy-to-understand overview of what this project is, how it's built, and exactly how you can get it running on your own machine in just a few minutes. Whether you are a beginner looking to explore a modern tech stack or a seasoned developer reviewing the architecture, this guide has you covered.

---

## 1. What is this project?
This is a **Full-Stack Human Resource Management System (HRMS)**. It's a web application designed to handle various HR tasks like tracking employee attendance, managing leave requests, handling payroll, tracking reimbursements, and managing company announcements. 

The project is built using a modern architecture called a **Modular Monolith**. This simply means that while the entire backend runs as a single application (which makes it very easy to host and run), the code inside is neatly separated into independent "modules" (like a Payroll module, a Leave module, etc.) so it stays organized as it grows.

---

## 2. The Tech Stack

### 🎨 The Frontend (What the user sees)
- **Framework**: [Next.js 16](https://nextjs.org/) (React)
- **Language**: TypeScript (JavaScript with strict type-checking)
- **Styling**: Tailwind CSS v4 (Using a sleek, premium deep blue/indigo custom color palette)
- **State Management**: React Context API & React Hooks (For clean, lightweight state management like user authentication sessions)

### ⚙️ The Backend (The brain of the app)
- **Framework**: [.NET 10](https://dotnet.microsoft.com/) (ASP.NET Core Web API)
- **Language**: C#
- **Architecture**: Domain-Driven Design (DDD)
- **Database**: **SQLite** (via Entity Framework Core). 
  - *Note: We specifically chose SQLite for you so you don't have to install or configure a database server! It saves everything into a simple local file called `app.db`.*

---

## 3. Key Features
We have completed **9 out of 12** core HR modules, meaning the following major systems are fully operational with data tables and UI interfaces:
1. **Time & Attendance**
2. **Leave Management**
3. **Payroll**
4. **Reimbursements**
5. **Performance Reviews**
6. **Team Management**
7. **Recruitment**
8. **Training**
9. **Contributions**

### ⏱️ Live Cumulative Daily Timer
The Time & Attendance module features a robust, real-time tracking engine:
- **Cumulative Tracking**: When you clock in, a live `HH:MM:SS` timer starts ticking. If you clock out and clock back in later that day, the timer automatically calculates your previous shifts and picks up exactly where you left off, giving you your **true daily total**.
- **Progress Bar**: The dashboard features an active progress bar that visually fills up in real-time as you approach a standard 8-hour daily target.
- **Timezone Safety**: The system uses UTC under the hood to ensure your hours are calculated perfectly, no matter where you are logging in from.

### 🔐 Role-Based Access Control (RBAC)
The application is smart! During registration, you can choose a role (`Admin`, `HR`, or `Employee`). When a user logs in, the system dynamically changes the UI:
- **Employees** see a streamlined dashboard focused only on their attendance, leaves, and payroll.
- **HR and Admins** unlock sensitive administrative modules like Team Management, Recruitment, and Performance Reviews.

---

## 4. How to Run It Locally

Running this project on your machine is incredibly simple because the database automatically creates itself. You do **not** need to install PostgreSQL, SQL Server, or Docker.

### Prerequisites
Make sure you have the following installed on your computer:
1. **Node.js** (v18 or higher) - For the frontend.
2. **.NET 10.0 SDK** - For the backend. (Make sure you install specifically the .NET 10 SDK).

### Step 1: Start the Backend (API)
Open your terminal or command prompt, navigate to the backend API folder, and run it:
```bash
# Navigate to the API folder
cd backend/API/HRMS.API

# Run the backend
dotnet run
```
*When the backend starts up for the first time, it will automatically generate the SQLite database file (`app.db`) and create all the necessary tables for you! It will run on `http://localhost:5056` (or whichever port Kestrel assigns - check terminal output).*

### Step 2: Start the Frontend (Website)
Open a **new** terminal window, navigate to the frontend folder, and start the development server:
```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies (only needed the first time)
npm install

# Start the Next.js frontend
npm run dev
```

### Step 3: View the App!
Open your web browser and go to:
[http://localhost:3000](http://localhost:3000)

### Step 4: Testing the App
1. Go to the **Register** page and create a new account. Try selecting the `Admin` role to see all features.
2. Log in with your new credentials.
3. On the dashboard, hit **Clock In** to test the live cumulative timer and progress bar!
4. Explore the left sidebar tabs to interact with Leave Management, Payroll, and other generic modules.

---
*Happy coding!*
