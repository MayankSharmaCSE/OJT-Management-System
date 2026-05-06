# OJT Management System - Final Demo Script

**Total Time Limit:** 20 Minutes
**Presenters:** [Your Name] (Backend) & [Partner's Name] (Frontend)

---

## 1. Project Pitch (⏱️ 3 Minutes)
*(Both of you can share this part, or one can lead)*

**The Problem:**
"During traditional On-the-Job Training (OJT), tracking student progress, managing daily logbooks, and facilitating communication between mentors and students is often scattered, paper-based, or lost in long email threads. It's difficult for mentors to evaluate performance efficiently and for administrators to oversee the whole program."

**Our Solution (What it is):**
"To solve this, we built the **OJT Management System** — a centralized, role-based web application. It brings students, mentors, and admins onto a single platform."

**End Goals & Value:**
"Our goal is to digitize and streamline the entire training lifecycle. For students, it provides an easy way to log daily tasks and view feedback. For mentors, it offers real-time tracking and grading. For admins, it gives a bird's-eye view of the entire organization's training progress."

---

## 2. Live Demo (⏱️ 7 Minutes)
*(Show, don't just tell. Make sure both backend and frontend servers are running before the meet!)*

**Admin Flow:**
- Log in as an Admin.
- Show the dashboard (overview of active students and mentors).
- Briefly show how to assign a student to a mentor.

**Student Flow:**
- Open an incognito window or log out.
- Log in as a Student.
- Show the Student Dashboard (mention the charts/graphs showing their progress).
- **Action:** Submit a daily logbook entry live.

**Mentor Flow:**
- Log in as a Mentor.
- Show the Mentor Dashboard (viewing assigned students).
- **Action:** Open the logbook the student just submitted, review it, leave feedback, and grade it.

---

## 3. Methodology & Algorithms (⏱️ 4 Minutes)
*(Explain how you built it and the logic behind it)*

**[Your Partner] - Frontend Methodology:**
- "On the client side, we used a Single Page Application (SPA) approach using **React** and **Vite**."
- "We managed state and secure routes using React Router, ensuring that users can only access dashboards permitted by their JWT role."
- "For data representation, we implemented an algorithm to parse the raw logbook data from the API and map it dynamically into **Chart.js**, giving real-time visual progress."

**[You] - Backend Methodology:**
- "On the server side, we adopted a robust API-driven architecture using **FastAPI** and **Python**."
- "Our core approach revolves around **Role-Based Access Control (RBAC)**. When a user logs in, we use bcrypt to verify credentials and issue a JSON Web Token (JWT). Every subsequent API request passes through a dependency injection algorithm that decodes the token and verifies if the user has the correct permissions (Admin, Mentor, or Student) before touching the database."
- "For data integrity, we used **SQLAlchemy ORM** to enforce strict relational mappings between Users, Tasks, and Submissions in our **PostgreSQL** database, ensuring there are no orphaned records."

---

## 4. Folder Structure & Code Walkthrough (⏱️ 5 Minutes)
*(Have VS Code open and ready)*

**[You] - Backend Code Walkthrough:**
- **Structure:** Show the `backend/` folder. Point out the separation of concerns: `routers/` (endpoints), `schemas/` (Pydantic validation), `models/` (Database tables), and `core/` (security/auth).
- **Code Highlights:** 
  - Show `models.py` (Briefly show a relationship, e.g., Student to Mentor).
  - Show a key API route (e.g., `routers/submission.py`). Explain how Pydantic validates the incoming payload before it reaches the database.

**[Your Partner] - Frontend Code Walkthrough:**
- **Structure:** Show the `frontend/src/` folder. Highlight `components/` (reusable UI), `pages/` (page views), and `services/` (Axios API calls).
- **Code Highlights:** 
  - Show the Axios interceptor (how the JWT token is attached to every request automatically).
  - Show `MentorDashboard.tsx` (explain how the component fetches data on mount and manages loading/error states).

---

## 5. Q&A / Closing (⏱️ 1 Minute)
"That concludes our demonstration of the OJT Management System. Thank you for your time, we'd be happy to answer any questions about our implementation or design choices."

---

### 💡 Pro-Tips for the Demo:
1. **Clear your Database:** Before the demo, clear out any "test1234" garbage data and create clean, professional-sounding test accounts (e.g., `john.student@example.com`, `sarah.mentor@example.com`).
2. **Rehearse the Hand-offs:** Practice saying, *"Now I'll pass it over to my partner to explain the frontend architecture."*
3. **Have it Running:** Start your `run.sh` script 15 minutes before the meeting starts so you aren't waiting for servers to boot up while people are watching.
