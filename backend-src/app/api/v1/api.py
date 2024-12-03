from fastapi import APIRouter
from app.api.v1.endpoints import customer_intelligence, social_auth, growth_strategy

api_router = APIRouter()

api_router.include_router(
    customer_intelligence.router,
    prefix="/customer-intelligence",
    tags=["customer-intelligence"]
)

api_router.include_router(
    social_auth.router,
    prefix="/auth",
    tags=["auth"]
)

api_router.include_router(
    growth_strategy.router,
    prefix="/growth",
    tags=["growth"]
)
