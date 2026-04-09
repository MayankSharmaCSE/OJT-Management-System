from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime

class SubmissionBase(BaseModel):
    task_id: int
    content: str

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionGrade(BaseModel):
    grade: int = Field(ge=0, le=100)
    feedback: Optional[str] = None

class SubmissionInDBBase(SubmissionBase):
    id: Optional[int] = None
    student_id: int
    status: str = "pending"
    grade: Optional[int] = None
    feedback: Optional[str] = None
    submitted_at: datetime

    class Config:
        from_attributes = True

class Submission(SubmissionInDBBase):
    pass
