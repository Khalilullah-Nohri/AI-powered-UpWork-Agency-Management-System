# 🤖 AI-Powered Job Scraping & Task Management System

[![Made with React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Backend Flask](https://img.shields.io/badge/Backend-Flask-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Database MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Build with VS Code](https://img.shields.io/badge/IDE-VS%20Code-007ACC?logo=visual-studio-code&logoColor=white)](https://code.visualstudio.com/)
[![Postman Tested](https://img.shields.io/badge/API%20Tested-Postman-orange?logo=postman&logoColor=white)](https://www.postman.com/)

---

## 🧠 Overview

An **AI-driven full-stack web system** that automates **Upwork job scraping**, **resume-job matching**, and **proposal generation**, along with complete **task management and role-based dashboards**.  
The system integrates **React.js (frontend)** and **Flask (backend)**, using **SQLAlchemy ORM** with **SQLyog** for database management.  
Authentication is handled with **JWT**, and all API communication uses **RESTful endpoints** tested via **Postman**.

---

## 🚀 Key Features

✅ Automated job scraping from Upwork using Selenium  
✅ Resume–Job similarity matching (Sentence Transformers + cosine similarity)  
✅ AI-based proposal generation using Gemini API  
✅ Role-based dashboards for Admin, Manager, and Member  
✅ Task creation, assignment, and tracking with priority & deadlines  
✅ JWT authentication with protected routes   
✅ Flask-Migrate for schema management  
✅ Fully modular, scalable code architecture  

---

## 🧩 Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Frontend** | React.js, Tailwind CSS, Axios, Vite |
| **Backend** | Flask, SQLAlchemy ORM |
| **Database** | MySQL (managed via SQLyog) |
| **AI & Automation** | Gemini API, Selenium, Sentence Transformers |
| **Auth & API** | JWT, RESTful APIs |
| **Environment & Tools** | Pipenv, Node.js, Postman, VS Code |

---


## 🗂️ Project Directory Structure

### 🖥️ Frontend — `client/`

```bash
client/
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.js
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   └── ResumeUploader.jsx
│   ├── css/
│   │   ├── style.css
│   │   ├── tailwind.config.js
│   │   └── additional-styles/
│   │       ├── range-slider.css
│   │       ├── toggle-switch.css
│   │       ├── theme.css
│   │       └── utility-patterns.css
│   ├── images/
│   │   ├── hero-image.png
│   │   ├── features-bg.png
│   │   └── favicon.png
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── ManagerDashboard.jsx
│   │   ├── MemberDashboard.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   └── ResetPassword.jsx
│   ├── partials/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── HeroHome.jsx
│   ├── services/
│   │   └── api.js
│   └── utils/
│       └── auth.js
```

### 🧠 Backend — `server/`

```bash
server/
├── app.py                  # Flask entry point
├── config.py               # Configurations & DB connection
├── Pipfile                 # Pipenv dependencies
├── Pipfile.lock
├── requirements.txt        # Optional fallback dependencies
├── mysql commands.sql      # Manual DB table creation queries
├── .env                    # Environment variables
├── controllers/
│   ├── auth_controller.py
│   └── __init__.py
├── models/
│   ├── job.py
│   ├── task.py
│   ├── user.py
│   └── __init__.py
├── routes/
│   ├── auth_routes.py
│   ├── job_routes.py
│   ├── match_routes.py
│   ├── task_routes.py
│   ├── user_routes.py
│   └── __init__.py
└── utils/
    ├── auth_wrappers.py
    ├── feasibility.py
    ├── gemini_helper.py
    ├── jwt_utils.py
    ├── mail_utils.py
    ├── resume_matcher.py
    ├── scraper.py
    └── __init__.py
```

---

## 🔐 Authentication & Roles

| Role | Capabilities |
|------|---------------|
| **Admin** | Scrape jobs, evaluate feasibility, generate proposals, send emails |
| **Manager** | Create, assign, and monitor tasks |
| **Member** | View and update assigned tasks |

- Protected using **JWT tokens** (stored client-side).
- Role-based middleware validation on backend routes.

---

## 🧪 API Testing

All REST APIs were thoroughly verified with **Postman**.  
Data exchange between **frontend (Axios)** and **backend (Flask)** is handled in **JSON** format, ensuring secure and consistent communication.

---

## ⚙️ Setup Instructions

### 🔸 Backend (Flask)
```bash
cd server

# Install dependencies
pipenv install

# (Alternative if Pipenv not installed)
pip install -r requirements.txt

# Copy environment example and configure your credentials
# also Open .env and replace placeholder values with your own credentials (e.g., MySQL username/password, Gemini API key, email credentials).
These variables are required for the backend to connect to your database and email service.

# macOS/Linux:
cp .env.example .env
# Windows (PowerShell):
copy .env.example .env


# Activate virtual environment
pipenv shell

# Run the Flask server
python app.py

```

### 🔹 Frontend (React)
```bash
cd client
# Install all Node dependencies (node_modules will auto-generate)
npm install

# Start development server
npm run dev

```

Access via → [http://localhost:5173](http://localhost:5173)

---

## 🧰 Database Setup

Database migrations and schema management are handled via **Flask-Migrate (Alembic)**.

```bash
# Initialize and apply migrations
pipenv run flask db init
pipenv run flask db migrate -m "Initial migration"
pipenv run flask db upgrade
```  
Connection details are stored in `.env` and loaded through `config.py`.

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=job_management
JWT_SECRET=your_secret_key
```

---

## 💡 Development Tools Used

- **IDE:** Visual Studio Code  
- **Database GUI:** SQLyog  
- **API Testing:** Postman  
- **Environment Management:** Pipenv  
- **Version Control:** Git & GitHub  

---

## 👨‍💻 Author

**Developed by [Khalilullah Nohri](https://www.linkedin.com/in/khalilullah-dev)**  
💻 Python & JavaScript Developer  
📩 For queries or collaboration: **nohrikhalilullah@gmail.com**  
🌐 [GitHub](https://github.com/Khalilullah-Nohri) • [LinkedIn](https://www.linkedin.com/in/khalilullah-dev)


---

## 🧾 License

This project is licensed under the [MIT License](LICENSE).  
© 2025 — AI-Powered Job Scraping & Task Management System
