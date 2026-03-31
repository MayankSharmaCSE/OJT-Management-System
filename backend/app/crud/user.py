from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.ojt_models import User, Batch
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(
        email=user.email,
        hashed_password=get_password_hash(user.password),
        full_name=user.full_name,
        role=user.role,
        batch_id=user.batch_id,
        mentor_id=user.mentor_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        print(f"Auth failed: User {email} not found")
        return False
    if not verify_password(password, user.hashed_password):
        print(f"Auth failed: Password mismatch for user {email}")
        return False
    return user
