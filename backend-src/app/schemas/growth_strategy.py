from pydantic import BaseModel
from typing import List, Literal

class MetricData(BaseModel):
    name: str
    current: float
    target: float

class Strategy(BaseModel):
    id: str
    title: str
    description: str
    progress: float
    status: Literal["pending", "in_progress", "completed"]

class GrowthStrategyResponse(BaseModel):
    metrics: List[MetricData]
    strategies: List[Strategy]
