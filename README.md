# 💬 Real-Time Chat Application (Project-Based Learning)

This is a full-featured **real-time chat web application** built using **Node.js**, **Express**, **MongoDB**, and **MySQL** — designed and developed as part of my personal **project-based learning journey**.

The project aims to simulate production-grade systems, focus on backend, and covers a range of technologies including real-time communication, session management, containerization, and scalable architecture.

---

## 🧠 Purpose

This project is built not just to function as a chat app, but as a learning platform for mastering real-world backend and full-stack skills, including:

- Real-time communication via WebSockets
- Session handling with encryption and database persistence
- Multi-database architecture (SQL + NoSQL)
- Scalable deployment using Docker and Kubernetes -
    - |- **[not yet implemented]**
- Clean code structure (MVC pattern)
- Git version control and development best practices

---

## 🚀 Features

- 🔐 **security** – Register and login securely with session management
    - **|- [express session]**
    - **|- [parameterized queries to lower the risk of injection]**
    - **|- [proper sanitization using helmet for XSS]**
    - **|- [rate limiting]**
    - **|- [CORS]**
- 💬 **Private Messaging** – 1-on-1 direct chats between users
- 👥 **Group Messaging** – Join or create chat groups (MVP)
    - |- **[not yet implemented]**
- 📥 **Message Storage** – Uses MongoDB for flexible message handling
- 📄 **User Profiles** – SQL-based structured user and location information
- 🚫 **Blocking System** – Users can block others to prevent unwanted messages 
    - |- **[not yet implemented]**
- 🕒 **Timestamps** – All messages and activities are time-tracked
- 🧩 **Modular Codebase** – Follows an MVC-style structure for maintainability
    - |- **[refactor to OOP]**
- 🐳 **Dockerized** – Easily deployable using Docker containers
    - |- **[not yet implemented]**
- ☁️ **K8s Ready** – Built with container orchestration in mind

---

## 🛠️ Tech Stack

| Layer          | Technology                             |
|----------------|----------------------------------------|
| **Frontend**   | simpe ui and vanilla html, css, js     |
| **Backend**    | Node.js, Express.js                    |
| **Real-time**  | Socket.IO or WebSocket                 |
| **Database**   | MongoDB (NoSQL) + MySQL (SQL)          |
| **Auth & Sessions** | Express-Session, Cookies          |
| **DevOps**     | Docker, Kubernetes (planned), Git      |

---

## 📁 Project Structure (Simplified)

---

## 📸 Screenshot

- **This what UI must look like**

![App Screenshot](https://github.com/hunter123322/typescript-try/blob/handling-offline-send-message/screenshot/Screenshot%202024-12-05%20135720.png?raw=true)

- **This is action must look like**

![App Screenshot](https://github.com/hunter123322/typescript-try/blob/handling-offline-send-message/screenshot/Screenshot%202024-12-05%20135756.png)
![App Screenshot](https://github.com/hunter123322/typescript-try/blob/handling-offline-send-message/screenshot/Screenshot%202024-12-05%20135813.png)
![App Screenshot](https://github.com/hunter123322/typescript-try/blob/handling-offline-send-message/screenshot/Screenshot%202024-12-05%20135831.png)
![App Screenshot](https://github.com/hunter123322/typescript-try/blob/handling-offline-send-message/screenshot/Screenshot%202024-12-05%20135901.png)

---

- **Flowchart**

![App Screenshot](https://github.com/hunter123322/typescript-try/blob/handling-offline-send-message/screenshot/Screenshot%202025-06-23%20164322.png)


- **Refactor the root file** 
----src/
    ├── app.ts                      # Express app configuration
    |
    ├── socket/                     # WebSocket server
    │   └── socketServer.ts         # Socket.io/Socket logic
    |
    ├── controllers/                # HTTP handlers
    │   ├── auth/
    │   │   ├── login.ts
    │   │   └── logout.ts
    |   |   
    │   ├── signup/
    │   │   ├── step1/
    |   |   |   └── signup.ts
    |   |   ├── step2/
    |   |   |   └── information.ts
    |   |   └── step3/
    |   |       └── location.ts
    |   |
    │   └── message/
    │       └── messageController.ts
    |
    ├── models/                     # Data definitions
    │   ├── user/
    |   |   ├── user.model.ts
    |   |   ├── user.mongo.model.ts
    |   |   └── user.sql.model.ts
    |   |
    │   └── messagesModel.ts
    |
    ├── services/                   # Business logic
    │   ├── auth/
    │   │   └── passwordService.ts
    |   |
    │   └── user/
    │       └── user.service.ts
    |
    ├── views/                      # Templates
    │   └── message.ejs
    |
    ├── middleware/
    │   ├── securityHeaders.ts
    |   ├── securityHeaders.ts
    |   └── session.ts
    |
    ├── db/                         # Database
    │   ├── mongodbConnections.ts
    │   └── mySQLConnectionPool.ts
    |
    └── routes/                     # Route definitions
        └── router.ts
        