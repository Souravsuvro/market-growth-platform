from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
import httpx
from app.core.auth import get_current_user
from app.schemas.user import User
from app.schemas.growth_strategy import (
    GrowthStrategyResponse,
    MetricData,
    Strategy
)
from app.core.config import settings

router = APIRouter()

API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
headers = {"Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}"}

async def generate_growth_insights(company_data: dict) -> dict:
    try:
        prompt = f"""
        As a business growth strategist, analyze this company:
        Industry: {company_data['industry']}
        Size: {company_data['size']}
        Revenue: {company_data['revenue']}
        Growth Rate: {company_data['growth_rate']}
        Target Market: {company_data['target_market']}
        
        Provide growth strategies and metrics.
        """
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                API_URL,
                headers=headers,
                json={"inputs": prompt, "parameters": {"max_length": 500}}
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="AI model request failed")
                
            ai_insights = response.json()[0]['generated_text']
        
        # Generate metrics based on company data
        metrics = [
            MetricData(
                name="Customer Acquisition",
                current=int(float(company_data['revenue'].replace('$', '').replace('M', '')) * 100),
                target=int(float(company_data['revenue'].replace('$', '').replace('M', '')) * 120)
            ),
            MetricData(
                name="Revenue Growth",
                current=int(float(company_data['revenue'].replace('$', '').replace('M', '')) * 1000000),
                target=int(float(company_data['revenue'].replace('$', '').replace('M', '')) * 1200000)
            ),
            MetricData(
                name="Market Share",
                current=int(float(company_data['growth_rate'].replace('%', ''))),
                target=int(float(company_data['growth_rate'].replace('%', '')) * 1.3)
            ),
            MetricData(
                name="Customer Retention",
                current=85,
                target=95
            ),
        ]
        
        # Parse AI insights into strategies
        insights_list = [s.strip() for s in ai_insights.split('.') if s.strip()]
        strategies = []
        
        for i, insight in enumerate(insights_list[:4], 1):
            progress = 90 if i == 1 else 65 if i == 2 else 40 if i == 3 else 25
            status = "completed" if progress >= 90 else "in_progress" if progress >= 40 else "pending"
            
            strategies.append(
                Strategy(
                    id=str(i),
                    title=f"Strategy {i}",
                    description=insight,
                    progress=progress,
                    status=status
                )
            )
        
        return {"metrics": metrics, "strategies": strategies}
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating growth insights: {str(e)}"
        )

@router.get("/growth-strategy", response_model=GrowthStrategyResponse)
async def get_growth_strategy(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Retrieve growth strategy metrics and active strategies using AI insights
    """
    try:
        # Sample company data - in production, this would come from your database
        company_data = {
            "industry": "Technology",
            "size": "Medium",
            "revenue": "5M",
            "growth_rate": "15",
            "target_market": "B2B SaaS",
            "main_products": ["Market Analysis Tool", "Customer Intelligence Platform"]
        }
        
        return await generate_growth_insights(company_data)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error occurred while fetching growth strategy data: {str(e)}"
        )
