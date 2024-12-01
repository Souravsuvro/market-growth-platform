from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Any
import random
from datetime import datetime, timedelta

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/customer-intelligence/segments")
async def get_segments() -> List[Dict[str, Any]]:
    return [
        {
            "id": "1",
            "name": "High Value",
            "count": random.randint(100, 200),
            "characteristics": ["Frequent Buyers", "High AOV", "Long-term Customer"],
            "description": "Customers with high lifetime value and frequent purchases"
        },
        {
            "id": "2",
            "name": "Growth Potential",
            "count": random.randint(200, 400),
            "characteristics": ["Medium AOV", "Occasional Buyers", "Engaged"],
            "description": "Customers showing potential for increased engagement"
        },
        {
            "id": "3",
            "name": "At Risk",
            "count": random.randint(50, 150),
            "characteristics": ["Declining Activity", "Support Issues", "Price Sensitive"],
            "description": "Customers showing signs of churn risk"
        }
    ]

@app.get("/customer-intelligence/behaviors")
async def get_behaviors() -> List[Dict[str, Any]]:
    return [
        {"type": "purchase", "count": random.randint(500, 1000)},
        {"type": "browsing", "count": random.randint(2000, 5000)},
        {"type": "support", "count": random.randint(100, 300)}
    ]

@app.get("/customer-intelligence/metrics")
async def get_metrics() -> Dict[str, Any]:
    return {
        "summary": {
            "total_customers": random.randint(1000, 2000),
            "active_customers": random.randint(800, 1500),
            "churn_rate": round(random.uniform(0.02, 0.08), 3),
            "average_lifetime_value": round(random.uniform(800, 1500), 2)
        }
    }

@app.get("/customer-intelligence/engagement")
async def get_engagement() -> List[Dict[str, Any]]:
    return [
        {
            "date": (datetime.now() - timedelta(days=x)).strftime("%Y-%m-%d"),
            "engagement": random.randint(70, 95),
            "satisfaction": random.randint(75, 98)
        }
        for x in range(7)
    ]

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
