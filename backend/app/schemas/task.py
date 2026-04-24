from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: str
    priority: str = "medium"
    status: str = "pending"
    student_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    student_id: Optional[int] = None

class TaskInDBBase(TaskBase):
    id: Optional[int] = None
    created_by: int
    student_id: Optional[int] = None

    class Config:
        from_attributes = True

class Task(TaskInDBBase):
    pass
