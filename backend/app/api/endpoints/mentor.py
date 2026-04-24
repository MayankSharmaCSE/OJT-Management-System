from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api import deps
from app.schemas.user import User, UserCreate
from app.schemas.task import Task, TaskCreate
from app.schemas.submission import Submission, SubmissionGrade
from app.db.models.ojt_models import User as UserModel, Task as TaskModel, Submission as SubmissionModel

router = APIRouter()

@router.get("/students", response_model=List[User])
def read_mentor_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_mentor),
) -> Any:
    """
    Retrieve students assigned to the mentor's batch (or via mentor_id if it existed).
    Since mentor_id is missing, for now we return all students in the mentor's batch.
    """
    return db.query(UserModel).filter(UserModel.batch_id == current_user.batch_id, UserModel.role == "student").all()

@router.post("/tasks", response_model=Task)
def create_task(
    *,
    db: Session = Depends(get_db),
    task_in: TaskCreate,
    current_user: User = Depends(deps.get_current_active_mentor),
) -> Any:
    """
    Create a new task.
    """
    db_task = TaskModel(
        title=task_in.title,
        description=task_in.description,
        deadline=task_in.deadline,
        priority=task_in.priority,
        status=task_in.status,
        created_by=current_user.id,
        student_id=task_in.student_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/submissions", response_model=List[Submission])
def read_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_mentor),
) -> Any:
    """
    Retrieve submissions for tasks created by the mentor.
    """
    return db.query(SubmissionModel).join(TaskModel).filter(TaskModel.created_by == current_user.id).all()

@router.post("/submissions/{submission_id}/grade", response_model=Submission)
def grade_submission(
    *,
    db: Session = Depends(get_db),
    submission_id: int,
    grade_in: SubmissionGrade,
    current_user: User = Depends(deps.get_current_active_mentor),
) -> Any:
    """
    Grade a student submission.
    """
    submission = db.query(SubmissionModel).get(submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    submission.grade = grade_in.grade
    submission.feedback = grade_in.feedback
    submission.status = "reviewed"
    db.commit()
    db.refresh(submission)
    return submission

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_task(
    *,
    db: Session = Depends(get_db),
    task_id: int,
    current_user: UserModel = Depends(deps.get_current_active_mentor),
):
    """
    Delete a task.
    """
    task = db.query(TaskModel).get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.created_by != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(task)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
