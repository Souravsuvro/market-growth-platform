from typing import Any, Dict, Optional
from pydantic import EmailStr, Field
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Market Growth Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    DEBUG: bool = Field(default=True)
    ENVIRONMENT: str = Field(default="development")
    
    # Security
    SECRET_KEY: str = Field(default=os.getenv("SECRET_KEY", ""))
    EMAIL_SECRET_KEY: str = Field(default=os.getenv("EMAIL_SECRET_KEY", ""))
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = Field(
        default="postgresql://postgres:postgres@localhost/market_growth_db"
    )
    POSTGRES_SERVER: str = Field(default="localhost")
    POSTGRES_USER: str = Field(default="postgres")
    POSTGRES_PASSWORD: str = Field(default="postgres")
    POSTGRES_DB: str = Field(default="market_growth_db")
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # Email
    SENDGRID_API_KEY: str = Field(default=os.getenv("SENDGRID_API_KEY", ""))
    SENDGRID_FROM_EMAIL: EmailStr = Field(default="noreply@example.com")
    
    # Frontend
    FRONTEND_URL: str = Field(default=os.getenv("FRONTEND_URL", "http://localhost:3000"))
    
    # API Keys
    TWITTER_BEARER_TOKEN: str = Field(default=os.getenv("TWITTER_BEARER_TOKEN", ""))
    HUGGINGFACE_API_KEY: Optional[str] = None
    HUGGINGFACE_API_URL: str = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
    HUBSPOT_API_KEY: str = Field(default=os.getenv("HUBSPOT_API_KEY", ""))
    
    # OAuth Settings
    FACEBOOK_CLIENT_ID: Optional[str] = Field(default=os.getenv("FACEBOOK_CLIENT_ID", ""))
    FACEBOOK_CLIENT_SECRET: Optional[str] = Field(default=os.getenv("FACEBOOK_CLIENT_SECRET", ""))
    FACEBOOK_REDIRECT_URI: str = Field(default=os.getenv("FACEBOOK_REDIRECT_URI", "http://localhost:8000/api/v1/auth/facebook/callback"))
    
    # First superuser
    FIRST_SUPERUSER_EMAIL: EmailStr = Field(default="admin@example.com")
    FIRST_SUPERUSER_PASSWORD: str = Field(default="admin123")  # Change this in production!

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
