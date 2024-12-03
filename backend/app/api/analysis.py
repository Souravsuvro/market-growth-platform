from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List
from app.models.business import BusinessProfile
from app.analysis.market_analyzer import MarketAnalyzer
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/analyze/market", response_model=Dict)
async def analyze_market(
    business_profile: BusinessProfile,
    current_user = Depends(get_current_user)
):
    """
    Generate comprehensive market analysis based on business profile
    """
    try:
        analyzer = MarketAnalyzer(business_profile)
        analysis = analyzer.generate_comprehensive_analysis()
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate market analysis: {str(e)}"
        )

@router.post("/analyze/location/{location_id}", response_model=Dict)
async def analyze_location(
    location_id: str,
    business_profile: BusinessProfile,
    current_user = Depends(get_current_user)
):
    """
    Generate detailed analysis for a specific location
    """
    try:
        analyzer = MarketAnalyzer(business_profile)
        location = next(
            (loc for loc in business_profile.preferred_locations if loc.id == location_id),
            None
        )
        if not location:
            raise HTTPException(
                status_code=404,
                detail=f"Location with ID {location_id} not found"
            )
        
        analysis = analyzer.analyze_location(location)
        return analysis.dict()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze location: {str(e)}"
        )

@router.post("/analyze/technology", response_model=Dict)
async def analyze_technology(
    business_profile: BusinessProfile,
    current_user = Depends(get_current_user)
):
    """
    Analyze technology stack and provide recommendations
    """
    try:
        analyzer = MarketAnalyzer(business_profile)
        analysis = analyzer.analyze_technology_stack()
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze technology stack: {str(e)}"
        )

@router.post("/analyze/challenges", response_model=Dict)
async def analyze_challenges(
    business_profile: BusinessProfile,
    current_user = Depends(get_current_user)
):
    """
    Analyze business challenges and generate solution roadmap
    """
    try:
        analyzer = MarketAnalyzer(business_profile)
        analysis = analyzer.analyze_challenges()
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze challenges: {str(e)}"
        )
