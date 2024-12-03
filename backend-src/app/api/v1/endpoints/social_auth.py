from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Any
import requests
from urllib.parse import urlencode

from app.core.config import settings
from app.core.security import create_access_token
from app.crud import crud_user
from app.db.session import get_db
from app.schemas.user import UserCreate

router = APIRouter()

@router.get("/facebook")
async def facebook_login() -> Any:
    """
    Initiate Facebook OAuth flow
    """
    params = {
        "client_id": settings.FACEBOOK_CLIENT_ID,
        "redirect_uri": settings.FACEBOOK_REDIRECT_URI,
        "scope": "email",
        "response_type": "code",
    }
    
    facebook_auth_url = f"https://www.facebook.com/v12.0/dialog/oauth?{urlencode(params)}"
    return RedirectResponse(url=facebook_auth_url)

@router.get("/facebook/callback")
async def facebook_callback(
    request: Request,
    code: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Handle Facebook OAuth callback
    """
    try:
        # Exchange code for access token
        token_url = "https://graph.facebook.com/v12.0/oauth/access_token"
        token_params = {
            "client_id": settings.FACEBOOK_CLIENT_ID,
            "client_secret": settings.FACEBOOK_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.FACEBOOK_REDIRECT_URI,
        }
        
        token_response = requests.get(token_url, params=token_params)
        token_data = token_response.json()
        
        if "error" in token_data:
            raise HTTPException(
                status_code=400,
                detail=f"Facebook OAuth error: {token_data['error']['message']}"
            )
        
        # Get user info from Facebook
        user_info_url = "https://graph.facebook.com/me"
        user_info_params = {
            "fields": "id,name,email",
            "access_token": token_data["access_token"],
        }
        
        user_info_response = requests.get(user_info_url, params=user_info_params)
        user_info = user_info_response.json()
        
        if "error" in user_info:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to get user info from Facebook: {user_info['error']['message']}"
            )
        
        # Check if user exists
        user = crud_user.get_user_by_email(db, email=user_info["email"])
        
        if not user:
            # Create new user
            user_in = UserCreate(
                email=user_info["email"],
                name=user_info["name"],
                password=None,  # Social auth users don't need password
                is_verified=True,  # Email is verified by Facebook
            )
            user = crud_user.create_user(db, obj_in=user_in)
        
        # Create access token
        access_token = create_access_token(subject=str(user.id))
        
        # Redirect to frontend with token
        frontend_callback_url = f"{settings.FRONTEND_URL}/auth/callback?token={access_token}"
        return RedirectResponse(url=frontend_callback_url)
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process Facebook callback: {str(e)}"
        )
