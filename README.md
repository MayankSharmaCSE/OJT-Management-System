# OJT Management System

Role-Based Internship / OJT Management System is a centralized, secure platform for managing internship workflows.

---

## 📖 Documentation
- **[Comprehensive Project Guide](GUIDE.md)** - Detailed architecture, feature walkthrough, and advanced setup.
- **[Backend README](backend/README.md)** - Specifics for the FastAPI server.
- **[Frontend README](frontend/README.md)** - Specifics for the React application.

## 📌 Table of Contents
1. [Quick Start (Automated)](#-quick-start-automated)
2. [Tech Stack](#-tech-stack)
3. [Prerequisites](#-prerequisites)
4. [Manual Setup](#-manual-setup)
5. [Default Credentials](#-default-credentials)
6. [Important Notes](#-important-notes-localtunnelexternal-access)
7. [Project Structure](#-project-structure)

---

## 🚀 Quick Start (Automated)

The project includes a `run.sh` script that automatically sets up the database, backend, and frontend.

```bash
chmod +x run.sh
./run.sh
```
This will start:
- **Frontend** on [http://localhost:3000](http://localhost:3000)
- **Backend** on [http://localhost:8000](http://localhost:8000)
- **API Docs** on [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠 Tech Stack

- **Frontend**: React.js / Vite / Tailwind CSS
- **Backend**: Python / FastAPI
- **Database**: PostgreSQL
- **Auth**: JWT (JSON Web Tokens)

---

## 📋 Prerequisites

1.  **Python 3.8+**
2.  **Node.js & npm**
3.  **PostgreSQL** (running locally on port 5432)

---

## 🚧 Manual Setup

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 init_db.py  # Reset/Initialize Database
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

---

## 👥 Default Credentials

After running `init_db.py`, use these accounts for testing:

- **Admin**: `admin@ojt.com` / `admin123`
- **Mentor**: `mentor@ojt.com` / `mentor123`
- **Student**: `student@ojt.com` / `student123`

---

## ⚠️ Important Notes (Localtunnel/External Access)

If you use `localtunnel` (e.g., `npx localtunnel --port 3000`):
1.  **Mixed Content**: Accessing an HTTPS tunnel while the backend is on HTTP (`localhost:8000`) might be blocked by browsers.
2.  **CORS**: Ensure your tunnel URL is added to `CORS_ORIGINS` in `backend/.env`.
3.  **Workaround**: For full remote access, tunnel BOTH port 3000 and 8000, and update `frontend/.env` with the backend tunnel link.

---

## 📂 Project Structure
```text
Anti_OJT/
├── backend/            # FastAPI Project
│   ├── app/            # Source code
│   └── init_db.py      # Database Seeder
├── frontend/           # React + Vite Project
│   └── src/            # Components, Context, Pages
├── run.sh              # Orchestration Script
└── README.md           # This File
```
