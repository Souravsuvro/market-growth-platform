from sqlalchemy.orm import Session
from app.core.config import settings
from app.schemas.user import UserCreate
from app.crud import crud_user

def init_db(db: Session) -> None:
    """Initialize the database with default data."""
    # Create a default admin user if it doesn't exist
    user = crud_user.get_user_by_email(db, email=settings.FIRST_SUPERUSER_EMAIL)
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER_EMAIL,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            name="Admin"
        )
        user = crud_user.create_user(db, obj_in=user_in)
        user.is_verified = True
        db.commit()
