from typing import Optional
from sqlalchemy.orm import Session
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate

def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, obj_in: UserCreate) -> User:
    db_obj = User(
        email=obj_in.email,
        name=obj_in.name,
        hashed_password=get_password_hash(obj_in.password),
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def authenticate(db: Session, *, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def verify_user(db: Session, user_id: int) -> User:
    user = get_user(db, user_id)
    if user:
        user.is_verified = True
        db.commit()
        db.refresh(user)
    return user

def reset_password(db: Session, user_id: int, new_password: str) -> User:
    user = get_user(db, user_id)
    if user:
        user.hashed_password = get_password_hash(new_password)
        db.commit()
        db.refresh(user)
    return user
