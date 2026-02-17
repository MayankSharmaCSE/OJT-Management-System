# OJT-Management-System
The Role-Based Internship / OJT Management System is a web-based application designed to digitally manage and monitor internship and On-the-Job Training (OJT) programs in educational institutions or organizations. 

📘 Role-Based Internship / OJT Management System
📌 Project Overview

The Role-Based Internship / OJT Management System is a web-based application designed to digitally manage internship and On-the-Job Training (OJT) programs.
It provides a centralized, secure, and role-based platform for students, mentors, and administrators to manage tasks, submissions, evaluations, and progress tracking efficiently.

🎯 Problem Statement

Managing OJT programs manually leads to:

Poor task tracking

Lack of transparency in evaluations

Inefficient communication between students and mentors

Difficulty in maintaining records

This project aims to automate and streamline the complete OJT workflow using modern web technologies.

👥 User Roles

Administrator – Manages users, roles, batches, and system monitoring

Mentor – Assigns tasks, reviews submissions, and evaluates students

Student – Views tasks, submits work, and tracks progress

✨ Key Features

Secure JWT-based authentication

Role-Based Access Control (RBAC)

Task assignment and submission system

Mentor feedback and evaluation

Progress tracking dashboard

Centralized data management

🛠 Tech Stack

Frontend: React.js, HTML, CSS, JavaScript

Backend: Python (FastAPI / Flask)

Database: PostgreSQL / MySQL

Authentication: JWT (JSON Web Token)

Tools: Git, GitHub, Postman

🔄 System Workflow

User logs in using credentials

JWT token is generated

Role is identified (Admin / Mentor / Student)

User accesses role-specific dashboard

Tasks are assigned, submitted, reviewed, and evaluated

Progress is updated in real time

📊 Stretch Features (If Time Permits)

Performance-based student ranking system

File uploads for task submissions

Email / in-app notifications

Certificate generation

Advanced analytics and reports

🗓 Project Timeline

Week 1–2: Requirement analysis & system design

Week 3–6: Authentication, database, and core backend

Week 7–10: Role modules & dashboards

Week 11–12: Testing, documentation & final submission

🚀 Getting Started (Local Setup)
# Clone the repository
git clone https://github.com/your-username/ojt-management-system.git

# Backend setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend setup
cd frontend
npm install
npm start

🧪 Testing

API testing using Postman

Role-based access testing

Manual UI testing for workflows

📚 Learning Outcomes

Implemented secure JWT authentication

Designed role-based systems

Built RESTful APIs

Learned database design and normalization

Improved collaboration using GitHub

👨‍💻 Contributors

Your Name – Backend & System Design

Friend’s Name – Frontend & UI

📄 License

This project is developed as part of On-the-Job Training (OJT) for academic purposes.

✅ One-Line Summary

A secure, role-based web application to manage internships and OJT programs efficiently.