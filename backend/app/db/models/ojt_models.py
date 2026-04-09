from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MENTOR = "mentor"
    STUDENT = "student"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=True)
    mentor_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    batch = relationship("Batch", back_populates="users")
    mentor = relationship("User", remote_side=[id], backref="assigned_students")
    tasks_created = relationship("Task", back_populates="creator")
    submissions = relationship("Submission", back_populates="student")

class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    users = relationship("User", back_populates="batch")

class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    deadline = Column(String)  # Using string for simplicity or DateTime
    priority = Column(String, default="medium")
    status = Column(String, default=TaskStatus.PENDING)
    created_by = Column(Integer, ForeignKey("users.id"))
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    creator = relationship("User", back_populates="tasks_created", foreign_keys=[created_by])
    assigned_student = relationship("User", foreign_keys=[student_id])
    submissions = relationship("Submission", back_populates="task", cascade="all, delete-orphan")

class SubmissionStatus(str, enum.Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    grade = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)
    status = Column(String, default=SubmissionStatus.PENDING)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

    task = relationship("Task", back_populates="submissions")
    student = relationship("User", back_populates="submissions")
