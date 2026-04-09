from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api import deps
from app.db.models.ojt_models import User as UserModel, Task as TaskModel, Submission as SubmissionModel
from app.schemas.task import Task
from app.schemas.submission import Submission, SubmissionCreate

router = APIRouter()

@router.get("/tasks", response_model=List[Task])
def read_student_tasks(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve tasks.
    """
    return db.query(TaskModel).filter(
        (TaskModel.student_id == current_user.id) | (TaskModel.student_id == None)
    ).all()

@router.post("/submissions", response_model=Submission)
def create_submission(
    *,
    db: Session = Depends(get_db),
    submission_in: SubmissionCreate,
    current_user: UserModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Submit a task.
    """
    db_submission = SubmissionModel(
        task_id=submission_in.task_id,
        student_id=current_user.id,
        content=submission_in.content
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

@router.get("/my-submissions", response_model=List[Submission])
def read_my_submissions(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve current student's submissions.
    """
    return db.query(SubmissionModel).filter(SubmissionModel.student_id == current_user.id).all()
