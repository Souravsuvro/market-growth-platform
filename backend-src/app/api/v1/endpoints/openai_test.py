from fastapi import APIRouter, HTTPException
from app.integrations.openai_integration import OpenAIIntegration
from typing import Dict

router = APIRouter()
openai_client = OpenAIIntegration()

@router.post("/test-market-insights")
async def test_market_insights(data: Dict):
    """
    Test endpoint for OpenAI market insights generation
    
    Example request body:
    {
        "industry": "SaaS",
        "context": "B2B software company focusing on project management tools"
    }
    """
    try:
        result = await openai_client.generate_market_insights(
            industry=data.get("industry"),
            context=data.get("context")
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test-growth-strategies")
async def test_growth_strategies(business_data: Dict):
    """
    Test endpoint for generating growth strategies
    
    Example request body:
    {
        "industry": "E-commerce",
        "size": "small",
        "revenue": "1M",
        "target_market": "B2C fashion retailers"
    }
    """
    try:
        result = await openai_client.generate_growth_strategies(business_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
