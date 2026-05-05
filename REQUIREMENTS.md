# 📋 Project Requirements — OJT Management System

> A complete list of software, hardware, and functional requirements for the OJT Management System.

---

## 🖥️ Software Requirements

### Development Tools
| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| Python | 3.10+ | Backend runtime |
| Node.js | 18.0+ | Frontend runtime |
| npm | 9.0+ | Package manager for frontend |
| Git | 2.30+ | Version control |
| VS Code (recommended) | Latest | Code editor |

### Backend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| FastAPI | 0.111.0 | Web framework for building REST APIs |
| Uvicorn | 0.30.1 | ASGI server for running FastAPI locally |
| Gunicorn | 22.0.0 | Production WSGI/ASGI server for deployment |
| SQLAlchemy | 2.0.31 | ORM for database interaction |
| Psycopg2-Binary | ≥2.9.9 | PostgreSQL database adapter for Python |
| Pydantic | ≥2.7.4 | Data validation and settings management |
| Pydantic-Settings | ≥2.3.4 | Environment variable management |
| Python-Jose | 3.3.0 | JWT token generation and verification |
| Passlib (bcrypt) | 1.7.4 | Password hashing and verification |
| Python-Multipart | 0.0.9 | Form data and file upload parsing |
| Python-Dotenv | 1.0.1 | Loading environment variables from `.env` |
| CORS | 1.0.1 | Cross-Origin Resource Sharing middleware |

### Frontend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.3.1 | UI library for building components |
| React Router | 7.13.0 | Client-side routing and navigation |
| Vite | 6.3.5 | Build tool and development server |
| TailwindCSS | 4.1.12 | Utility-first CSS framework |
| Axios | ^1.13.6 | HTTP client for API communication |
| Chart.js | ^4.5.1 | Data visualization and charting |
| React-Chartjs-2 | ^5.3.1 | React wrapper for Chart.js |
| Radix UI | Various | Accessible, unstyled UI primitives |
| Lucide React | 0.487.0 | Icon library |
| Sonner | 2.0.3 | Toast notifications |
| React Hook Form | 7.55.0 | Form state management and validation |
| Motion (Framer) | 12.23.24 | Animations and transitions |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 16+ | Relational database for persistent storage |

---

## 🌐 Deployment Infrastructure

| Service | Platform | Purpose |
|---------|----------|---------|
| Frontend Hosting | Vercel | Static site hosting with CDN |
| Backend Hosting | Render | Python web service hosting |
| Database Hosting | Neon | Serverless PostgreSQL |

---

## 🔧 Hardware Requirements (Minimum)

| Component | Specification |
|-----------|--------------|
| Processor | Intel i3 / Apple M1 or equivalent |
| RAM | 4 GB |
| Storage | 500 MB free disk space |
| Internet | Required for deployment and database access |
| OS | Windows 10+, macOS 12+, or Ubuntu 20.04+ |

---

## 📌 Functional Requirements

### 1. Authentication & Authorization
- Secure login system with role-based access control (Admin, Mentor, Student).
- JWT-based token authentication for API security.
- Password hashing using bcrypt algorithm.

### 2. Admin Dashboard
- View and manage all users (mentors and students).
- Create and manage batches.
- Monitor overall system activity and statistics.
- Data visualization using charts and graphs.

### 3. Mentor Dashboard
- Create, edit, and delete tasks with title, description, deadline, and priority.
- Assign tasks to specific students.
- Review student submissions and provide grades and feedback.
- Track task completion status across assigned students.

### 4. Student Dashboard
- View assigned tasks with deadlines and priority levels.
- Submit task responses with text content.
- Track submission status (Pending / Reviewed).
- View grades and mentor feedback on submissions.

### 5. Database Design
- **Users Table:** Stores user credentials, roles, batch assignments, and mentor links.
- **Batches Table:** Organizes students into academic batches.
- **Tasks Table:** Stores task details with mentor-student assignment mapping.
- **Submissions Table:** Records student submissions with grading and feedback.
- Cascading deletes to maintain referential integrity.

### 6. API Design
- RESTful API architecture with versioned endpoints (`/api/v1/`).
- Proper HTTP status codes and error handling.
- CORS configuration for cross-origin frontend-backend communication.
- Interactive API documentation via Swagger UI (`/docs`).

---

## 🔒 Non-Functional Requirements

| Requirement | Description |
|-------------|-------------|
| **Security** | Passwords are never stored in plain text; JWT tokens expire after a set duration. |
| **Performance** | Database queries optimized with indexes on frequently searched columns. |
| **Scalability** | Decoupled frontend and backend architecture allows independent scaling. |
| **Responsiveness** | Frontend is fully responsive across desktop, tablet, and mobile devices. |
| **Maintainability** | Modular code structure with clear separation of concerns (MVC pattern). |
| **Availability** | Deployed on cloud platforms (Vercel, Render, Neon) with high uptime SLAs. |

---

## 🌍 Environment Variables

### Backend (`.env`)
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8000
```

---

*Document maintained by Mayank Sharma & Priyanshu Prajapati*
