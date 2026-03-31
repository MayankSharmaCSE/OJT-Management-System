print("DEBUG: Script started")
import sys
import os

# Ensure the backend directory is in the path BEFORE other imports
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from sqlalchemy import select
from app.db.session import engine, Base, SessionLocal
from app.db.models.ojt_models import User, Task, Submission, Batch
from app.core.security import get_password_hash

def init_db():
    print("🚀 Initializing Database...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Create default batch
        batch = db.execute(select(Batch).filter(Batch.name == "Batch 2024")).scalar_one_or_none()
        if not batch:
            batch = Batch(name="Batch 2024")
            db.add(batch)
            db.commit()
            db.refresh(batch)
            print(f"✅ Created batch: {batch.name}")
        else:
            print(f"ℹ️ Batch '{batch.name}' already exists.")

        # 2. Create default admin
        admin = db.execute(select(User).filter(User.email == "admin@ojt.com")).scalar_one_or_none()
        if not admin:
            admin = User(
                email="admin@ojt.com",
                hashed_password=get_password_hash("admin123"),
                full_name="OJT Admin",
                role="admin"
            )
            db.add(admin)
            print(f"✅ Created admin user: {admin.email}")
        else:
            print(f"ℹ️ Admin user '{admin.email}' already exists.")

        # 3. Create default mentor
        mentor = db.execute(select(User).filter(User.email == "mentor@ojt.com")).scalar_one_or_none()
        if not mentor:
            mentor = User(
                email="mentor@ojt.com",
                hashed_password=get_password_hash("mentor123"),
                full_name="OJT Mentor",
                role="mentor",
                batch_id=batch.id
            )
            db.add(mentor)
            print(f"✅ Created mentor user: {mentor.email}")
        else:
            print(f"ℹ️ Mentor user '{mentor.email}' already exists.")

        # 4. Create default student
        student = db.execute(select(User).filter(User.email == "student@ojt.com")).scalar_one_or_none()
        if not student:
            student = User(
                email="student@ojt.com",
                hashed_password=get_password_hash("student123"),
                full_name="OJT Student",
                role="student",
                batch_id=batch.id
            )
            db.add(student)
            print(f"✅ Created student user: {student.email}")
        else:
            print(f"ℹ️ Student user '{student.email}' already exists.")
            
        db.commit()
            
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()
    
    print("✨ Database initialization completed successfully!")

if __name__ == "__main__":
    init_db()
