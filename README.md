# 🚀 Job Tracker System – Installation & Setup Guide

A full-stack **Job Tracker System** built with **Django (Backend)** and **React (Frontend)** to manage and track job applications efficiently.

---

## 📌 Prerequisites

Before starting, ensure you have the following installed:

- Python **3.10+**
- Node.js **18+** and npm
- Git
- Virtual environment support

---

## 🖼️ Application Screenshots

All screenshots are stored in the **`CodeSnaps/`** folder.

---

### 📊 Dashboard

![Dashboard](CodeSnaps/dashboard.png)
![Dashboard](CodeSnaps/dashboard2.png)
![Dashboard](CodeSnaps/dashboard3.png)
![Dashboard](CodeSnaps/dashboard4.png)

---

### 🔐 Login Page

![Login](CodeSnaps/login.png)
![Login](CodeSnaps/login2.png)
![Login](CodeSnaps/login3.png)

---

### 📋 Job Listings / Kanban View

![Jobs](CodeSnaps/kanban.png)

---

### 📌 More Screens

![Register](CodeSnaps/register.png)

![Profile](CodeSnaps/profile.png)
![Profile](CodeSnaps/profile2.png)
![Profile](CodeSnaps/profile3.png)

![Change Password](CodeSnaps/changepassword.png)
![Verify OTP](CodeSnaps/verifyotp.png)
![Send OTP](CodeSnaps/sendotp.png)
![Set New Password](CodeSnaps/setnewpassword.png)

---

## 🔹 Installation Guide

### 🔸 Backend Setup (Django)

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sameer9860/Job-Tracker.git
cd Job-Tracker

```

---

#### 2️⃣ Create Virtual Environment

```bash
python -m venv env
```

---

#### 3️⃣ Activate Virtual Environment

**Windows (PowerShell)**

```powershell
.\env\Scripts\activate
```

**Windows (CMD)**

```cmd
env\Scripts\activate
```

**macOS / Linux**

```bash
source env/bin/activate
```

---

#### 4️⃣ Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

#### 5️⃣ Apply Database Migrations

```bash
python manage.py migrate
```

---

#### 6️⃣ Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

👉 Follow the prompts to create an admin account.

---

#### 7️⃣ Run Django Development Server

```bash
python manage.py runserver
```

🌐 Backend URL: **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

---

### 🔸 Frontend Setup (React)

#### 8️⃣ Navigate to React Frontend

```bash
cd job-tracker-frontend
```

---

#### 9️⃣ Install Frontend Dependencies

```bash
npm install
```

---

#### 🔟 Start React Development Server

```bash
npm start
```

🌐 Frontend URL: **[http://localhost:3000/](http://localhost:3000/)**

---

## ✅ Features

* User Authentication
* Job Application Tracking
* Application Status Management
* Admin Dashboard
* Django REST + React Integration
* Responsive UI

---

## 🛠️ Tech Stack

* **Backend:** Django, Django REST Framework
* **Frontend:** React, npm
* **Database:** SQLite / PostgreSQL
* **Version Control:** Git & GitHub

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

⭐ If you like this project, don’t forget to give it a star on GitHub!
