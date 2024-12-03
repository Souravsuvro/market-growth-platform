from typing import Optional, Dict
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.config import settings
from app.core.security import verify_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=False
)

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[Dict]:
    """
    Get the current user from the token.
    Returns None if no token is provided (for public endpoints).
    Raises HTTPException if token is invalid.
    """
    if not token:
        return None
        
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except JWTError:
        return None
        
    return {"id": user_id}
