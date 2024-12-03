from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel, HttpUrl
from ..services.competitor_analysis import CompetitorAnalyzer
import logging
import asyncio

router = APIRouter()
analyzer = CompetitorAnalyzer()

class CompetitorURL(BaseModel):
    url: HttpUrl
    name: str

class CompetitorsRequest(BaseModel):
    competitors: List[CompetitorURL]

@router.post("/analyze")
async def analyze_competitor(competitor: CompetitorURL):
    """Analyze a single competitor's website and return insights."""
    try:
        analysis = await analyzer.analyze_competitor(str(competitor.url))
        return {
            "status": "success",
            "data": analysis
        }
    except Exception as e:
        logging.error(f"Error analyzing competitor: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/analyze-multiple")
async def analyze_multiple_competitors(request: CompetitorsRequest):
    """Analyze multiple competitor websites and return comparative insights."""
    try:
        # Analyze all competitors concurrently
        tasks = [
            analyzer.analyze_competitor(str(competitor.url))
            for competitor in request.competitors
        ]
        analyses = await asyncio.gather(*tasks)

        # Combine analyses with competitor names
        results = {
            comp.name: analysis
            for comp, analysis in zip(request.competitors, analyses)
        }

        # Generate comparative insights
        comparison = await analyzer.generate_comparison(results)

        return {
            "status": "success",
            "individual_analyses": results,
            "comparison": comparison
        }
    except Exception as e:
        logging.error(f"Error analyzing competitors: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/sample-competitors/{industry}")
async def get_sample_competitors(industry: str):
    """Get a list of sample competitors for a given industry."""
    # This is a mock implementation - you can expand this with a real database
    sample_competitors = {
        "tech": [
            {"name": "TechCorp", "url": "https://www.techcorp-example.com"},
            {"name": "InnovateTech", "url": "https://www.innovatetech-example.com"}
        ],
        "retail": [
            {"name": "RetailPro", "url": "https://www.retailpro-example.com"},
            {"name": "ShopMaster", "url": "https://www.shopmaster-example.com"}
        ],
        "healthcare": [
            {"name": "HealthPlus", "url": "https://www.healthplus-example.com"},
            {"name": "MedTech", "url": "https://www.medtech-example.com"}
        ]
    }
    
    return sample_competitors.get(industry.lower(), [])
