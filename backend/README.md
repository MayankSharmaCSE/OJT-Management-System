# OJT Management System Backend

This is the FastAPI backend for the Role-Based Internship Management System.

## Setup Instructions

1. **Prerequisites**:
   - Python 3.9+
   - PostgreSQL (Running locally or on a server)

2. **Environment Variables**:
   Create a `.env` file in the `backend` directory with the following:
   ```env
   SECRET_KEY=your_secret_key_here
   DATABASE_URL=postgresql://postgres:postgres@localhost/ojt_db
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize Database**:
   You can use a script to create the tables or use Alembic migrations.
   ```python
   # Simple script to create tables
   from app.db.session import engine, Base
   from app.db.models.ojt_models import User, Task, Submission, Batch
   Base.metadata.create_all(bind=engine)
   ```

5. **Run the Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`.
Swagger Documentation: `http://localhost:8000/docs`
