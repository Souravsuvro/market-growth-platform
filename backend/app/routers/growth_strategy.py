from fastapi import APIRouter, HTTPException, Depends, Body
from typing import Dict, Any
import httpx
import logging
import hashlib
import json
from ..core.config import settings
from ..schemas.growth_strategy import GrowthStrategyResponse, MetricData, Strategy
from ..utils.rate_limiter import RateLimiter, AICache

router = APIRouter()
logger = logging.getLogger(__name__)

rate_limiter = RateLimiter()
ai_cache = AICache()

async def generate_growth_insights(company_data: dict) -> dict:
    try:
        # Generate cache key based on company data
        cache_key = hashlib.md5(json.dumps(company_data, sort_keys=True).encode()).hexdigest()
        
        # Try to get cached response
        cached_response = await ai_cache.get_cached_response(cache_key)
        if cached_response:
            logger.info("Returning cached growth insights")
            return cached_response

        # Check rate limit before making API call
        if not await rate_limiter.check_rate_limit("huggingface_api"):
            logger.warning("Rate limit exceeded, using fallback data")
            return get_fallback_insights()

        logger.info("Generating growth insights for company data: %s", company_data)
        
        # For demo purposes, generate insights without AI if no API key
        if not settings.HUGGINGFACE_API_KEY:
            logger.info("No HuggingFace API key found, using demo data")
            return get_fallback_insights()

        prompt = f"""
        As a business growth strategist, analyze this company:
        Industry: {company_data.get('industry', 'Unknown')}
        Size: {company_data.get('size', 'Unknown')}
        Revenue: {company_data.get('revenue', 'Unknown')}
        Growth Rate: {company_data.get('growth_rate', 'Unknown')}
        Target Market: {company_data.get('target_market', 'Unknown')}
        Current Challenges: {company_data.get('current_challenges', 'None specified')}
        
        Provide specific, actionable growth strategies and key metrics to track.
        Format the response as a business plan with clear objectives and targets.
        """

        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.HUGGINGFACE_API_URL,
                headers={"Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}"},
                json={"inputs": prompt, "parameters": {"max_length": 500, "temperature": 0.7}},
                timeout=30.0
            )
            
            if response.status_code == 429:  # Rate limit exceeded
                logger.warning("HuggingFace API rate limit exceeded, using fallback data")
                return get_fallback_insights()
                
            response.raise_for_status()
            ai_response = response.json()
            
            # Parse AI response into our format
            strategies = []
            metrics = []
            
            try:
                # Extract strategies from AI response
                ai_text = ai_response[0]['generated_text'] if isinstance(ai_response, list) else ai_response['generated_text']
                strategy_points = [s.strip() for s in ai_text.split('\n') if s.strip()]
                
                for i, point in enumerate(strategy_points[:4], 1):
                    progress = 90 if i == 1 else 65 if i == 2 else 40 if i == 3 else 25
                    status = "completed" if progress >= 90 else "in_progress" if progress >= 40 else "pending"
                    
                    strategies.append(Strategy(
                        id=str(i),
                        title=f"Strategy {i}",
                        description=point,
                        progress=progress,
                        status=status
                    ))
                
                # Generate metrics based on company data
                revenue_str = company_data.get('revenue', '$10M').replace('$', '').replace('M', '')
                growth_rate_str = company_data.get('growth_rate', '15%').replace('%', '')
                
                try:
                    base_revenue = float(revenue_str) * 1000000
                    growth_rate = float(growth_rate_str)
                except ValueError:
                    base_revenue = 10000000  # Default $10M
                    growth_rate = 15  # Default 15%
                
                metrics = [
                    MetricData(name="Customer Acquisition", current=int(base_revenue/100000), target=int(base_revenue/80000)),
                    MetricData(name="Revenue Growth", current=int(base_revenue), target=int(base_revenue * (1 + growth_rate/100))),
                    MetricData(name="Market Share", current=growth_rate, target=min(growth_rate * 1.3, 100)),
                    MetricData(name="Customer Retention", current=85, target=95)
                ]
            
            except Exception as e:
                logger.error(f"Error parsing AI response: {e}")
                return get_fallback_insights()
            
            result = {"metrics": metrics, "strategies": strategies}
            
            # Cache the successful response
            await ai_cache.cache_response(cache_key, result)
            return result

    except httpx.HTTPError as e:
        logger.error(f"HTTP error occurred: {e}")
        return get_fallback_insights()
    except Exception as e:
        logger.error(f"Error generating insights: {e}")
        return get_fallback_insights()

def get_fallback_insights() -> dict:
    """Return fallback insights when AI service is unavailable"""
    return {
        "metrics": [
            MetricData(name="Customer Acquisition", current=120, target=150),
            MetricData(name="Revenue Growth", current=85000, target=100000),
            MetricData(name="Market Share", current=15, target=20),
            MetricData(name="Customer Retention", current=85, target=95)
        ],
        "strategies": [
            Strategy(
                id="1",
                title="Market Expansion",
                description="Expand into new geographic markets to increase customer base",
                progress=90,
                status="completed"
            ),
            Strategy(
                id="2",
                title="Product Innovation",
                description="Develop new features based on customer feedback",
                progress=65,
                status="in_progress"
            ),
            Strategy(
                id="3",
                title="Customer Retention",
                description="Implement loyalty program to improve retention",
                progress=40,
                status="in_progress"
            ),
            Strategy(
                id="4",
                title="Digital Transformation",
                description="Modernize internal processes and customer touchpoints",
                progress=25,
                status="pending"
            )
        ]
    }

@router.post("/", response_model=GrowthStrategyResponse)
async def create_growth_strategy(
    company_data: Dict[str, Any] = Body(...)
) -> Dict[str, Any]:
    """Generate growth strategy based on company data"""
    return await generate_growth_insights(company_data)

@router.get("/", response_model=GrowthStrategyResponse)
async def get_growth_strategy() -> Dict[str, Any]:
    """Get default growth strategy"""
    return get_fallback_insights()

@router.get("/health", response_model=Dict[str, Any])
async def health_check() -> Dict[str, Any]:
    """Check the health of the growth strategy service"""
    try:
        # Get cache stats
        cache_stats = await ai_cache.get_cache_stats()
        
        # Check if we can make a request
        can_make_request = await rate_limiter.check_rate_limit("huggingface_api")
        
        return {
            "status": "healthy",
            "cache": cache_stats,
            "rate_limiter": {
                "can_make_request": can_make_request,
                "max_requests_per_hour": rate_limiter.max_requests,
                "min_interval_seconds": rate_limiter.min_interval
            },
            "huggingface_api": {
                "configured": bool(settings.HUGGINGFACE_API_KEY)
            }
        }
    except Exception as e:
        logger.error(f"Health check error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Health check failed: {str(e)}"
        )
