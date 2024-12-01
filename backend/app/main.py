from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import growth_strategy, customer_intelligence, competitor_analysis

app = FastAPI(
    title="AI Market Growth Platform",
    description="API for AI-powered market growth analysis and optimization",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    growth_strategy,  # Move this first since it's our main feature
    prefix="/api/v1/growth-strategy",
    tags=["growth-strategy"]
)

app.include_router(
    customer_intelligence,
    prefix="/api/v1/customer-intelligence",
    tags=["customer-intelligence"]
)

app.include_router(
    competitor_analysis,
    prefix="/api/v1/competitor-analysis",
    tags=["competitor-analysis"]
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {
        "message": "Welcome to AI Market Growth Platform API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }
