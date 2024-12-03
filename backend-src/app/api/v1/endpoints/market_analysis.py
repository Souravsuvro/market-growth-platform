from fastapi import APIRouter, HTTPException
from typing import Dict, List
from app.services.market_analysis import MarketAnalysisService

router = APIRouter()
market_service = MarketAnalysisService()

@router.get("/trends/{industry}")
async def get_market_trends(
    industry: str,
    location: str = "global"
):
    """
    Get market trends and analysis for specific industry and location
    """
    try:
        analysis = await market_service.analyze_market_trends(industry, location)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/segment-customers")
async def segment_customers(
    customer_data: List[Dict]
):
    """
    Perform customer segmentation using AI clustering
    """
    try:
        segments = await market_service.segment_customers(customer_data)
        return segments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/market-size")
async def predict_market_size(
    industry_data: Dict
):
    """
    Predict market size and growth potential
    """
    try:
        prediction = await market_service.predict_market_size(industry_data)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
