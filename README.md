# 🛠️ Project Management System

A full-stack web application to streamline project planning, task tracking, and team collaboration — built using **React.js**, **Redux**, **Spring Boot**, and **MongoDB**.

## 🚩 Key Features
- 🔐 JWT-based Authentication (Signup/Login/Logout)
- 🧾 Project Dashboard with Search & Categories
- ✅ Task Management (To Do / In Progress / Done)
- 👥 Team Invitations via Email (token-based)
- 🗨️ Task Comments & Optional Chatbot Integration
- 🌍 Responsive UI with Tailwind CSS

## 🧰 Tech Stack
- **Frontend**: React.js, Redux Toolkit, Tailwind CSS
- **Backend**: Spring Boot, Spring Security, JavaMailSender
- **Database**: MongoDB (Cloud via Atlas)
- **API**: RESTful with JWT + Email Support

# Frontend (.env)
VITE_API_BASE_URL=https://your-backend.onrender.com/api

# Backend (application.properties)
- spring.data.mongodb.uri=mongodb+srv://<user>:<pass>@cluster.mongodb.net/project-db
- jwt.secret=your_jwt_secret
- email.username=your_email@example.com
- email.password=your_app_password

# 👨‍💻 Developed by Santhosh Kumar

