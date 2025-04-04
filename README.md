# 🚀 Project Management System

A full-stack **Project Management System** built using **React.js**, **Redux**, **Spring Boot**, and **MongoDB**. This application allows users to manage team-based software projects effectively, featuring task assignments, real-time collaboration, secure authentication, and chatbot support.

---

## 📘 Project Overview

This system is designed to simplify team project collaboration by allowing authenticated users to:

- Create and manage multiple software projects.
- Assign tasks to team members and track their progress.
- Invite members via email to join specific projects.
- Use a Kanban-style task management system (To Do, In Progress, Done).
- Comment on tasks for communication.
- Use a chatbot for basic query handling or support within the app.

The frontend is developed using **React.js** and **Redux** for state management, while the backend uses **Spring Boot** with **MongoDB** for data persistence. JWT is used for secure user authentication. The system also includes email invitation functionality using the Java Mail API.

---

## 🛠 Tech Stack

### Frontend
- React.js
- Redux
- Tailwind CSS
- Axios
- React Router

### Backend
- Spring Boot
- Spring Security (JWT)
- MongoDB
- Java Mail API

---

## ⚙️ Features

### 🔐 Authentication
- JWT-based user authentication
- Secure sign-up, login, and logout

### 📁 Project Dashboard
- Create and view projects
- Persistent storage with MongoDB
- Search bar to filter projects

### 📄 Project Details Page
- Shows project category, technologies used, and description
- Invite members via email with time-stamped tokens
- Task management:
  - Create tasks with statuses: To Do, In Progress, Done
  - Assign tasks to team members
- Commenting system
- Integrated chatbot for help

---

## 📦 Folder Structure

### Frontend (`/client`)
```
src/
├── components/
├── pages/
├── redux/
├── services/
└── App.js
```

### Backend (`/server`)
```
src/
├── controllers/
├── services/
├── models/
├── repositories/
├── config/
└── Application.java
```

---

## 🔗 API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/signin`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`

### Tasks
- `POST /api/tasks`
- `PUT /api/tasks/:id/status`

### Comments
- `POST /api/comments`

### Invitations
- `POST /api/invite`
- `GET /api/invite/verify?token=xxx`

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- Java 17+
- MongoDB
- Maven

### Installation

#### Frontend
```bash
cd client
npm install
npm run dev
```

#### Backend
```bash
cd server
mvn spring-boot:run
```

Update `application.properties` with your MongoDB URI and email settings.

---

## 🌍 Deployment

- **Frontend**: Vercel  
- **Backend**: Render  
- **Database**: MongoDB Atlas

---

## 📸 Screenshots (Optional)

_Add screenshots here showing the dashboard, task board, member invitation, etc._

---

## 🧪 Environment Variables

Backend (`application.properties`)
```
spring.data.mongodb.uri=your_mongodb_uri
spring.mail.username=your_email
spring.mail.password=your_app_password
jwt.secret=your_jwt_secret
```

Frontend (`.env`)
```
VITE_API_URL=http://localhost:8080/api
```

---

## 👨‍💻 Developer

**Santhosh S**  
📧 [GitHub - Santhosh-Sks](https://github.com/Santhosh-Sks)  
🎓 MCA @ Kongu Engineering College  
💼 Backend Developer | Data Structures Enthusiast

---

## 📄 License

This project is licensed under the MIT License.
