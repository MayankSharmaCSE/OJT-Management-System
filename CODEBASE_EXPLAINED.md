# 🧠 OJT Management System — Complete Codebase Explained

> **Written for beginners.** This guide explains every file, every folder, and every concept in this project like you're reading it for the first time. No prior knowledge assumed.

---

## 📌 Table of Contents

1. [What Is This Project?](#-what-is-this-project)
2. [The Big Picture — How It All Connects](#-the-big-picture--how-it-all-connects)
3. [Tech Stack Explained](#-tech-stack-explained)
4. [Folder Structure Overview](#-folder-structure-overview)
5. [Backend (Server-Side) — Explained File by File](#-backend-server-side--explained-file-by-file)
6. [Frontend (Client-Side) — Explained File by File](#-frontend-client-side--explained-file-by-file)
7. [How Authentication Works (Login Flow)](#-how-authentication-works-login-flow)
8. [How Data Flows Through the App](#-how-data-flows-through-the-app)
9. [Database Tables Explained](#-database-tables-explained)
10. [API Endpoints Cheat Sheet](#-api-endpoints-cheat-sheet)
11. [How to Run the Project](#-how-to-run-the-project)
12. [Glossary of Terms](#-glossary-of-terms)

---

## 🎯 What Is This Project?

This is an **OJT (On-the-Job Training) Management System** — a web application where:

| Role | What They Can Do |
|------|-----------------|
| **Admin** | Manage all users (create mentors & students), view all data |
| **Mentor** | Create tasks, view their students, grade submissions, delete tasks |
| **Student** | View assigned tasks, submit work, see grades & feedback |

Think of it like a **mini school management system** specifically for internship programs.

---

## 🏗 The Big Picture — How It All Connects

```
┌─────────────────────┐        HTTP Requests        ┌────────────────────┐
│                     │  ──────────────────────────► │                    │
│   FRONTEND (React)  │                              │  BACKEND (FastAPI) │
│   Port 3000         │  ◄────────────────────────── │  Port 8000         │
│                     │        JSON Responses        │                    │
└─────────────────────┘                              └────────┬───────────┘
     What users see                                           │
     & interact with                                          │ SQL Queries
                                                              ▼
                                                    ┌────────────────────┐
                                                    │   DATABASE         │
                                                    │   (PostgreSQL)     │
                                                    │   Port 5432        │
                                                    └────────────────────┘
                                                      Stores all the data
```

**In plain English:**
1. The **Frontend** is what users see in their browser (buttons, forms, pages)
2. When a user clicks something (like "Login"), the frontend sends a **request** to the **Backend**
3. The **Backend** processes the request, talks to the **Database**, and sends back a **response**
4. The frontend displays the response to the user

---

## 🛠 Tech Stack Explained

| Technology | What It Is | Where It's Used |
|-----------|-----------|----------------|
| **Python** | Programming language | Backend logic |
| **FastAPI** | Python web framework (like Express.js but for Python) | Building the API server |
| **SQLAlchemy** | ORM — lets you talk to the database using Python instead of SQL | Database operations |
| **PostgreSQL** | A powerful database system | Storing users, tasks, submissions |
| **JWT (JSON Web Tokens)** | A secure way to prove "I am logged in" | Authentication |
| **bcrypt** | Password hashing algorithm | Safely storing passwords |
| **React** | JavaScript library for building UIs | Frontend pages & components |
| **Vite** | Super-fast build tool for React | Running/building the frontend |
| **Tailwind CSS** | CSS framework using utility classes | Styling the frontend |
| **Axios** | HTTP client library | Frontend → Backend communication |
| **TypeScript** | JavaScript with types (less bugs) | All frontend code |

---

## 📂 Folder Structure Overview

```
Anti_OJT/
├── backend/                  # 🐍 The Python server (FastAPI)
│   ├── app/                  #    All the application source code
│   │   ├── api/              #    API routes (the URLs the frontend calls)
│   │   │   ├── deps.py       #    Shared dependencies (auth checks)
│   │   │   └── endpoints/    #    The actual API endpoint files
│   │   │       ├── auth.py   #       Login, Register, Get-Me
│   │   │       ├── admin.py  #       Admin-only actions
│   │   │       ├── mentor.py #       Mentor actions (tasks, grading)
│   │   │       └── student.py#       Student actions (submit work)
│   │   ├── core/             #    Core settings & security
│   │   │   ├── config.py     #       App configuration (DB URL, secrets)
│   │   │   └── security.py   #       Password hashing & JWT tokens
│   │   ├── crud/             #    CRUD = Create, Read, Update, Delete
│   │   │   └── user.py       #       Database operations for users
│   │   ├── db/               #    Database layer
│   │   │   ├── models/       #       Table definitions
│   │   │   │   └── ojt_models.py  #  User, Task, Submission, Batch tables
│   │   │   └── session.py    #       Database connection setup
│   │   ├── schemas/          #    Data validation shapes (Pydantic)
│   │   │   ├── user.py       #       What user data looks like
│   │   │   ├── task.py       #       What task data looks like
│   │   │   └── submission.py #       What submission data looks like
│   │   └── main.py           #    🚀 THE STARTING POINT of the backend
│   ├── init_db.py            #    Script to set up the database with sample data
│   ├── requirements.txt      #    List of Python packages needed
│   └── .env                  #    Secret settings (DB password, etc.)
│
├── frontend/                 # ⚛️  The React application
│   ├── src/                  #    All the source code
│   │   ├── app/              #    Main application code
│   │   │   ├── App.tsx       #    🚀 THE STARTING POINT of the frontend
│   │   │   ├── routes.ts     #    URL → Page mapping (unused, defined in App.tsx)
│   │   │   ├── api/
│   │   │   │   └── client.ts #    Axios setup (how frontend talks to backend)
│   │   │   ├── context/      #    React Context (shared state)
│   │   │   │   ├── AuthContext.tsx   #  Login/logout state management
│   │   │   │   └── DataContext.tsx   #  Tasks, submissions, students data
│   │   │   ├── components/   #    Reusable UI pieces
│   │   │   │   ├── DashboardLayout.tsx  # Shared layout (header + sidebar)
│   │   │   │   ├── ui/       #    Shadcn/Radix UI components (Button, Card, etc.)
│   │   │   │   └── figma/    #    Figma-generated components
│   │   │   └── pages/        #    Full pages the user sees
│   │   │       ├── LandingPage.tsx      # Homepage (/)
│   │   │       ├── Login.tsx            # Login page (/login)
│   │   │       ├── AdminDashboard.tsx   # Admin panel (/admin)
│   │   │       ├── MentorDashboard.tsx  # Mentor panel (/mentor)
│   │   │       ├── StudentDashboard.tsx # Student panel (/student)
│   │   │       └── NotFound.tsx         # 404 page
│   │   ├── styles/           #    CSS styling files
│   │   └── main.tsx          #    Entry point — renders App component
│   ├── index.html            #    The single HTML page React attaches to
│   ├── package.json          #    List of JavaScript packages needed
│   └── vite.config.ts        #    Vite build configuration
│
├── run.sh                    # 🏃 One-click script to start everything
├── README.md                 # Project overview
└── GUIDE.md                  # Detailed guide
```

---

## 🐍 Backend (Server-Side) — Explained File by File

### 1. `backend/app/main.py` — The Entry Point

> **Analogy:** This is like the "front door" of a restaurant. It decides which waiter (router) handles which table (URL).

```python
app = FastAPI(title=settings.PROJECT_NAME)

# Allow the frontend (different port) to talk to the backend
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS.split(','), ...)

# Route setup — each "include_router" connects a group of URLs:
app.include_router(auth.router,    prefix="/api/v1/auth",    tags=["auth"])
app.include_router(admin.router,   prefix="/api/v1/admin",   tags=["admin"])
app.include_router(mentor.router,  prefix="/api/v1/mentor",  tags=["mentor"])
app.include_router(student.router, prefix="/api/v1/student", tags=["student"])
```

**What's happening:**
- Creates the FastAPI application
- Sets up **CORS** (Cross-Origin Resource Sharing) — this tells the browser "yes, the frontend at `localhost:3000` is allowed to talk to me at `localhost:8000`"
- Connects 4 groups of API routes, each handling a different role

---

### 2. `backend/app/core/config.py` — Configuration

> **Analogy:** This is the app's "settings menu." It stores things like the database address and secret keys.

```python
class Settings(BaseSettings):
    PROJECT_NAME: str = "OJT Management System"
    API_V1_STR: str = "/api/v1"                          # All URLs start with this
    SECRET_KEY: str = "your-secret-key-here"              # Used to create JWT tokens
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8       # Token valid for 8 days
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost/ojt_db"
    CORS_ORIGINS: str = "http://localhost:3000"           # Allowed frontend URLs
```

**Key concept — `BaseSettings`:** This class from Pydantic reads values from the `.env` file. If a value is in `.env`, it overrides the default. This keeps secrets out of the code.

---

### 3. `backend/app/core/security.py` — Passwords & Tokens

> **Analogy:** This is the security guard. It creates ID badges (tokens) and checks if passwords are correct.

**Three functions:**

| Function | What It Does |
|----------|-------------|
| `create_access_token(subject)` | Creates a JWT token (a secret string that proves who you are) |
| `verify_password(plain, hashed)` | Checks if a typed password matches the stored hash |
| `get_password_hash(password)` | Converts a plain password like `"admin123"` into a scrambled hash that can't be reversed |

**Why hash passwords?** If someone steals the database, they can't read the actual passwords — they only see scrambled hashes like `$2b$12$LJ3...`.

---

### 4. `backend/app/db/session.py` — Database Connection

> **Analogy:** This sets up the phone line between the backend and the database.

```python
engine = create_engine(settings.DATABASE_URL)     # Creates the connection
SessionLocal = sessionmaker(bind=engine)          # Creates a "session factory"
Base = declarative_base()                         # Base class for all table definitions

def get_db():        # Used in every API endpoint to get a database session
    db = SessionLocal()
    try:
        yield db     # "yield" means: give the db to the endpoint, then clean up after
    finally:
        db.close()
```

**Key concept — `yield`:** Think of it like lending a book. You give it to someone, let them use it, and when they're done, you take it back (`db.close()`).

---

### 5. `backend/app/db/models/ojt_models.py` — Database Tables

> **Analogy:** This is the blueprint for your database tables — like designing a spreadsheet before filling it with data.

**Four tables are defined:**

#### 📋 `User` Table
| Column | Type | Description |
|--------|------|------------|
| `id` | Integer | Unique ID (auto-generated) |
| `full_name` | String | User's name |
| `email` | String | Email (must be unique) |
| `hashed_password` | String | Scrambled password |
| `role` | String | `"admin"`, `"mentor"`, or `"student"` |
| `is_active` | Boolean | Whether the account is active |
| `batch_id` | Integer | Which batch they belong to (FK → batches) |
| `mentor_id` | Integer | Which mentor is assigned (FK → users, self-referencing!) |

#### 📦 `Batch` Table
| Column | Type | Description |
|--------|------|------------|
| `id` | Integer | Unique ID |
| `name` | String | e.g., `"Batch 2024"` |

#### ✅ `Task` Table
| Column | Type | Description |
|--------|------|------------|
| `id` | Integer | Unique ID |
| `title` | String | Task name |
| `description` | Text | Detailed description |
| `deadline` | String | Due date |
| `priority` | String | `"low"`, `"medium"`, `"high"` |
| `status` | String | `"pending"`, `"in_progress"`, `"completed"` |
| `created_by` | Integer | ID of the mentor who created it (FK → users) |

#### 📝 `Submission` Table
| Column | Type | Description |
|--------|------|------------|
| `id` | Integer | Unique ID |
| `task_id` | Integer | Which task this is for (FK → tasks) |
| `student_id` | Integer | Who submitted it (FK → users) |
| `content` | Text | The actual submission text |
| `grade` | Integer | Score given by mentor (nullable) |
| `feedback` | Text | Mentor's comments (nullable) |
| `status` | String | `"pending"` or `"reviewed"` |
| `submitted_at` | DateTime | When it was submitted |

**Relationships (the arrows between tables):**

```mermaid
erDiagram
    BATCH ||--o{ USER : "has many"
    USER ||--o{ USER : "mentor has students"
    USER ||--o{ TASK : "creates"
    USER ||--o{ SUBMISSION : "submits"
    TASK ||--o{ SUBMISSION : "receives"
```

---

### 6. `backend/app/schemas/` — Data Validation (Pydantic)

> **Analogy:** Schemas are like **bouncers at the door** — they check that incoming data has the right shape before letting it in.

**Schemas ≠ Models:**
- **Models** (`db/models/`) → define what's stored in the database
- **Schemas** (`schemas/`) → define what data the API accepts/returns

**Example — User schemas:**
```python
class UserCreate(BaseModel):     # What the frontend sends to CREATE a user
    email: EmailStr              # Must be a valid email
    password: str                # Plain password (will be hashed)
    full_name: str
    role: str = "student"
    batch_id: int = None
    mentor_id: int = None

class User(BaseModel):           # What the API RETURNS (no password!)
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    batch_id: int
```

Notice: `UserCreate` has a `password` field, but `User` does NOT. This means the API never accidentally sends passwords back to the frontend.

---

### 7. `backend/app/crud/user.py` — Database Operations

> **Analogy:** CRUD stands for **Create, Read, Update, Delete** — the four basic things you do with data.

| Function | What It Does |
|----------|-------------|
| `get_user_by_email(db, email)` | Finds a user by their email |
| `create_user(db, user)` | Creates a new user (hashes the password first!) |
| `get_users(db)` | Returns a list of all users |
| `authenticate_user(db, email, password)` | Checks if email+password match → returns the user or `False` |

---

### 8. `backend/app/api/deps.py` — Dependency Injection (Auth Guards)

> **Analogy:** These are like **security checkpoints**. Before any API endpoint runs, these functions verify who's calling.

**Chain of checks:**

```
get_current_user          →  "Is this a valid JWT token? Who is this person?"
    ↓
get_current_active_user   →  "Is their account active (not disabled)?"
    ↓
get_current_active_admin  →  "Is their role 'admin'?"
get_current_active_mentor →  "Is their role 'mentor' or 'admin'?"
```

**How it works:** Each API endpoint declares which "check" it needs:

```python
# This endpoint ONLY works for admins:
@router.get("/users")
def read_users(current_user = Depends(get_current_active_admin)):
    ...

# This endpoint works for mentors AND admins:
@router.post("/tasks")
def create_task(current_user = Depends(get_current_active_mentor)):
    ...
```

---

### 9. `backend/app/api/endpoints/` — The API Routes

#### `auth.py` — Login & Registration
| Method | URL | What It Does | Auth Required? |
|--------|-----|-------------|----------------|
| `POST` | `/api/v1/auth/login` | Log in, get a JWT token | ❌ No |
| `POST` | `/api/v1/auth/register` | Create a new account | ❌ No |
| `GET` | `/api/v1/auth/me` | Get current user's profile | ✅ Yes |

#### `admin.py` — Admin Actions
| Method | URL | What It Does | Auth Required? |
|--------|-----|-------------|----------------|
| `GET` | `/api/v1/admin/users` | List all users | ✅ Admin only |
| `POST` | `/api/v1/admin/users` | Create a new user | ✅ Admin only |

#### `mentor.py` — Mentor Actions
| Method | URL | What It Does | Auth Required? |
|--------|-----|-------------|----------------|
| `GET` | `/api/v1/mentor/students` | List mentor's students | ✅ Mentor/Admin |
| `POST` | `/api/v1/mentor/tasks` | Create a new task | ✅ Mentor/Admin |
| `DELETE` | `/api/v1/mentor/tasks/{id}` | Delete a task | ✅ Mentor/Admin |
| `GET` | `/api/v1/mentor/submissions` | View submissions for mentor's tasks | ✅ Mentor/Admin |
| `POST` | `/api/v1/mentor/submissions/{id}/grade` | Grade a submission | ✅ Mentor/Admin |

#### `student.py` — Student Actions
| Method | URL | What It Does | Auth Required? |
|--------|-----|-------------|----------------|
| `GET` | `/api/v1/student/tasks` | List all tasks | ✅ Any logged-in user |
| `POST` | `/api/v1/student/submissions` | Submit work for a task | ✅ Any logged-in user |
| `GET` | `/api/v1/student/my-submissions` | View own submissions | ✅ Any logged-in user |

---

### 10. `backend/init_db.py` — Database Seeder

> **Analogy:** This is the "factory reset" script. It creates the database tables and adds sample users so you can test immediately.

**What it creates:**

| Item | Details |
|------|---------|
| Batch | `"Batch 2024"` |
| Admin | `admin@ojt.com` / `admin123` |
| Mentor | `mentor@ojt.com` / `mentor123` (in Batch 2024) |
| Student | `student@ojt.com` / `student123` (in Batch 2024) |

---

## ⚛️ Frontend (Client-Side) — Explained File by File

### 1. `frontend/src/main.tsx` — The Very First File

```tsx
createRoot(document.getElementById("root")!).render(<App />);
```

This finds the `<div id="root">` in `index.html` and renders the entire React app inside it. Everything starts here.

---

### 2. `frontend/src/app/App.tsx` — The App Shell

> **Analogy:** This is the skeleton of the app. It wraps everything in providers and sets up which URL shows which page.

```
<AuthProvider>          ←  Makes login/logout available everywhere
  <DataProvider>        ←  Makes tasks/submissions data available everywhere
    <RouterProvider>    ←  Decides which page to show based on the URL
  </DataProvider>
</AuthProvider>
```

**URL → Page mapping (routes):**

| URL | Page Component | Who Uses It |
|-----|---------------|-------------|
| `/` | `LandingPage` | Everyone (homepage) |
| `/login` | `Login` | Everyone |
| `/admin` | `AdminDashboard` | Admin users |
| `/mentor` | `MentorDashboard` | Mentor users |
| `/student` | `StudentDashboard` | Student users |
| `*` (anything else) | `NotFound` | 404 error page |

---

### 3. `frontend/src/app/api/client.ts` — API Client (Axios)

> **Analogy:** This is the "phone" the frontend uses to call the backend.

```typescript
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',   // Where the backend lives
});

// INTERCEPTOR: Automatically attaches the JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');  // Grab token from browser storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Add: "Authorization: Bearer abc123..."
  }
  return config;
});
```

**Key concept — Interceptor:** Instead of manually adding the token to every single API call, the interceptor does it automatically. Every request the frontend makes will include the JWT token if the user is logged in.

---

### 4. `frontend/src/app/context/AuthContext.tsx` — Auth State Management

> **Analogy:** This is the "memory" of who's logged in. Every component in the app can ask "who's the current user?" through this context.

**What it provides to the entire app:**

| Property/Function | What It Is |
|-------------------|-----------|
| `user` | Current logged-in user object (or `null`) |
| `login(email, password)` | Function to log in |
| `logout()` | Function to log out |
| `isAuthenticated` | `true` if someone is logged in |
| `isLoading` | `true` while checking if a saved token is still valid |

**Login flow inside `AuthContext`:**
1. Sends email + password to `POST /api/v1/auth/login`
2. Receives a JWT token back
3. Stores the token in `localStorage` (survives page refresh)
4. Calls `GET /api/v1/auth/me` to get the user's profile
5. Stores the user object in state

**On page refresh:**
1. Checks if there's a token in `localStorage`
2. If yes → calls `GET /api/v1/auth/me` to verify it's still valid
3. If valid → user stays logged in. If expired → logs out.

---

### 5. `frontend/src/app/context/DataContext.tsx` — Data State Management

> **Analogy:** This is the "data warehouse" for the app. It fetches and stores tasks, submissions, students, and mentors.

**What it provides:**

| Data | Description |
|------|------------|
| `tasks` | Array of all tasks |
| `submissions` | Array of submissions |
| `students` | Array of student users |
| `mentors` | Array of mentor users |

| Function | What It Does |
|----------|-------------|
| `refreshData()` | Re-fetches all data from the backend |
| `addTask(task)` | Creates a new task (mentor endpoint) |
| `deleteTask(taskId)` | Deletes a task (mentor endpoint) |
| `addSubmission(...)` | Submits work for a task (student endpoint) |
| `gradeSubmission(...)` | Grades a submission (mentor endpoint) |
| `addStudent(...)` | Creates a new student user (admin endpoint) |
| `addMentor(...)` | Creates a new mentor user (admin endpoint) |

**Smart data loading:** When data is refreshed, it loads different data based on the user's role:
- **Admin** → fetches all users, splits them into students & mentors
- **Mentor** → fetches their students, their task submissions, all tasks
- **Student** → fetches all tasks & their own submissions

---

### 6. `frontend/src/app/components/DashboardLayout.tsx` — Shared Layout

> **Analogy:** This is the "frame" that all dashboard pages share — the header bar, sidebar, and content area.

```
┌──────────────────────────────────────────────┐
│  HEADER: Logo  |  User Avatar  |  Logout btn │
├───────────┬──────────────────────────────────┤
│           │                                  │
│  SIDEBAR  │       MAIN CONTENT               │
│  (Nav)    │       (Changes per page)          │
│           │                                  │
│           │                                  │
└───────────┴──────────────────────────────────┘
```

- Responsive: sidebar collapses on mobile with a hamburger menu
- Shows the user's name/avatar and their role
- Uses Shadcn UI components (Button, Avatar, DropdownMenu)

---

### 7. `frontend/src/app/pages/` — The Dashboard Pages

Each role has its own large dashboard page:

| Page | Size | Features |
|------|------|----------|
| **AdminDashboard.tsx** | ~20KB | User management, create mentors/students, view all data, charts |
| **MentorDashboard.tsx** | ~23KB | Create/delete tasks, view students, grade submissions |
| **StudentDashboard.tsx** | ~26KB | View tasks, submit work, track grades & feedback |
| **LandingPage.tsx** | ~12KB | Public homepage with features, navigation to login |
| **Login.tsx** | ~9KB | Login form with email/password |
| **NotFound.tsx** | ~1KB | Simple 404 page |

---

## 🔐 How Authentication Works (Login Flow)

Here's the step-by-step flow when a user logs in:

```
   BROWSER                    FRONTEND (React)               BACKEND (FastAPI)              DATABASE
     │                              │                              │                           │
     │  1. User types email         │                              │                           │
     │     & password, clicks       │                              │                           │
     │     "Login"                  │                              │                           │
     │ ─────────────────────────►   │                              │                           │
     │                              │  2. POST /auth/login         │                           │
     │                              │     {email, password}        │                           │
     │                              │  ───────────────────────►    │                           │
     │                              │                              │  3. Find user by email    │
     │                              │                              │  ─────────────────────►   │
     │                              │                              │  ◄─────────────────────   │
     │                              │                              │  4. Compare password      │
     │                              │                              │     with bcrypt hash      │
     │                              │                              │  5. If match → create JWT │
     │                              │  ◄───────────────────────    │                           │
     │                              │  {access_token: "eyJ..."}    │                           │
     │                              │                              │                           │
     │                              │  6. Store token in           │                           │
     │                              │     localStorage             │                           │
     │                              │                              │                           │
     │                              │  7. GET /auth/me             │                           │
     │                              │     (with Bearer token)      │                           │
     │                              │  ───────────────────────►    │                           │
     │                              │                              │  8. Decode JWT → get email│
     │                              │                              │  9. Find user by email    │
     │                              │  ◄───────────────────────    │                           │
     │                              │  {id, name, role, ...}       │                           │
     │                              │                              │                           │
     │  10. Redirect to             │                              │                           │
     │      role-specific           │                              │                           │
     │      dashboard               │                              │                           │
     │ ◄────────────────────────    │                              │                           │
```

**After login, every API call includes the JWT token** in the `Authorization` header. The backend's `deps.py` verifies this token before allowing access.

---

## 🔄 How Data Flows Through the App

### Example: Mentor Creates a Task

```
1. Mentor fills out the "Create Task" form on MentorDashboard
         │
         ▼
2. MentorDashboard calls DataContext's `addTask(taskData)`
         │
         ▼
3. DataContext sends: POST /api/v1/mentor/tasks
   with body: { title, description, deadline, priority, status }
   and header: Authorization: Bearer <JWT token>
         │
         ▼
4. Backend mentor.py router receives the request
         │
         ▼
5. deps.py's `get_current_active_mentor` checks:
   - Is the JWT valid? ✅
   - Is the user active? ✅
   - Is their role mentor or admin? ✅
         │
         ▼
6. mentor.py creates a TaskModel object and saves to database
         │
         ▼
7. Database stores the new task, returns the saved data
         │
         ▼
8. Backend sends back the created task as JSON
         │
         ▼
9. DataContext calls `refreshData()` to reload all data
         │
         ▼
10. MentorDashboard re-renders showing the new task
```

---

## 🗄 Database Tables Explained

```mermaid
erDiagram
    BATCH {
        int id PK
        string name UK
    }
    USER {
        int id PK
        string full_name
        string email UK
        string hashed_password
        string role
        bool is_active
        int batch_id FK
        int mentor_id FK
    }
    TASK {
        int id PK
        string title
        text description
        string deadline
        string priority
        string status
        int created_by FK
    }
    SUBMISSION {
        int id PK
        int task_id FK
        int student_id FK
        text content
        int grade
        text feedback
        string status
        datetime submitted_at
    }

    BATCH ||--o{ USER : "contains"
    USER ||--o{ USER : "mentors"
    USER ||--o{ TASK : "creates"
    USER ||--o{ SUBMISSION : "submits"
    TASK ||--o{ SUBMISSION : "has"
```

**PK** = Primary Key (unique identifier)
**FK** = Foreign Key (refers to another table's ID)
**UK** = Unique Key (no duplicates allowed)

---

## 📡 API Endpoints Cheat Sheet

### Auth Endpoints (No Login Required)
```
POST   /api/v1/auth/login      →  Get JWT token
POST   /api/v1/auth/register   →  Create new user
GET    /api/v1/auth/me          →  Get current user profile (needs token)
```

### Admin Endpoints (Admin Only)
```
GET    /api/v1/admin/users      →  List all users
POST   /api/v1/admin/users      →  Create a user (any role)
```

### Mentor Endpoints (Mentor or Admin)
```
GET    /api/v1/mentor/students                    →  List mentor's students
POST   /api/v1/mentor/tasks                       →  Create a task
DELETE /api/v1/mentor/tasks/{task_id}              →  Delete a task
GET    /api/v1/mentor/submissions                  →  List submissions for mentor's tasks
POST   /api/v1/mentor/submissions/{id}/grade       →  Grade a submission
```

### Student Endpoints (Any Logged-In User)
```
GET    /api/v1/student/tasks           →  List all tasks
POST   /api/v1/student/submissions     →  Submit work
GET    /api/v1/student/my-submissions  →  List own submissions
```

---

## 🏃 How to Run the Project

### Quick Start (Automated)
```bash
chmod +x run.sh    # Make the script executable (first time only)
./run.sh           # Start everything!
```

### Manual Start

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate          # Activate Python virtual environment
pip install -r requirements.txt   # Install dependencies (first time only)
python3 init_db.py                # Set up database (first time only)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install          # Install dependencies (first time only)
npm run dev -- --host 0.0.0.0 --port 3000
```

### Then Open:
- **Frontend:** http://localhost:3000
- **Backend API Docs:** http://localhost:8000/docs (interactive Swagger UI!)

### Default Login Credentials:
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@ojt.com` | `admin123` |
| Mentor | `mentor@ojt.com` | `mentor123` |
| Student | `student@ojt.com` | `student123` |

---

## 📖 Glossary of Terms

| Term | Simple Explanation |
|------|--------------------|
| **API** | A set of URLs that the frontend calls to get/send data |
| **JWT** | A token (long string) that proves you're logged in, like a digital ID card |
| **bcrypt** | Algorithm that scrambles passwords so they can't be read |
| **CORS** | Browser security rule; the backend must explicitly allow the frontend's URL |
| **ORM** | Lets you use Python code instead of SQL to talk to the database |
| **Schema** | Rules that define what data should look like (e.g., email must be valid) |
| **Context (React)** | A way to share data across all components without passing props |
| **Endpoint** | A specific URL on the backend that does something (e.g., `/auth/login`) |
| **Middleware** | Code that runs on every request before it reaches the endpoint |
| **Dependency Injection** | FastAPI's `Depends()` — automatically runs checks/setup before endpoint code |
| **Foreign Key (FK)** | A column that references another table's ID — creates relationships |
| **Virtual Environment** | An isolated Python setup so packages don't conflict with other projects |
| **`localStorage`** | Browser storage that persists even after closing the tab |
| **Interceptor** | Axios feature that automatically modifies every request/response |
| **CRUD** | Create, Read, Update, Delete — the four basic database operations |
| **Pydantic** | Python library that validates data shapes and types |
| **Uvicorn** | The server that runs the FastAPI application |
| **Vite** | Super-fast build tool that bundles React code for the browser |

---

> 💡 **Tip:** The best way to learn this codebase is to run it, log in as each role, and trace what happens in the code when you click buttons. Use the **Swagger UI** at `http://localhost:8000/docs` to test API endpoints directly!
