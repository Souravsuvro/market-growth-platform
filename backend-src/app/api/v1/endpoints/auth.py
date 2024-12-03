from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Any
from datetime import timedelta

from app.core.config import settings
from app.core.security import (
    create_access_token,
    get_password_hash,
    verify_password,
    generate_verification_token,
    verify_token
)
from app.crud import crud_user
from app.db.session import get_db
from app.schemas.user import UserCreate, User, UserLogin
from app.schemas.token import Token
from app.core.auth import get_current_user
from app.utils.email import send_verification_email

router = APIRouter()

@router.post("/register", response_model=User)
def register(*, db: Session = Depends(get_db), user_in: UserCreate) -> Any:
    """
    Register new user.
    """
    user = crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists."
        )
    
    # Create user
    user = crud_user.create_user(db, obj_in=user_in)
    
    # Generate verification token
    token = generate_verification_token(user.email)
    
    # Send verification email
    send_verification_email(user.email, token)
    
    return user

@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login.
    """
    user = crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is inactive"
        )
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email first"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)) -> Any:
    """
    Verify user email.
    """
    email = verify_token(token)
    if not email:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification token"
        )
    
    user = crud_user.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    if user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email already verified"
        )
    
    crud_user.verify_user(db, user_id=user.id)
    return {"message": "Email verified successfully"}

@router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)) -> Any:
    """
    Password recovery.
    """
    user = crud_user.get_user_by_email(db, email=email)
    if not user:
        # Don't reveal that the user doesn't exist
        return {"message": "Password reset email sent if user exists"}
    
    token = generate_verification_token(email)
    # Send password reset email
    send_verification_email(email, token, is_password_reset=True)
    
    return {"message": "Password reset email sent if user exists"}

@router.post("/reset-password")
def reset_password(
    token: str,
    new_password: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Reset user password.
    """
    email = verify_token(token)
    if not email:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token"
        )
    
    user = crud_user.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    crud_user.reset_password(db, user_id=user.id, new_password=new_password)
    return {"message": "Password reset successfully"}
