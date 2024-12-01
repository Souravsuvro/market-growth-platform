from typing import Dict, List
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest,
    DateRange,
    Metric,
    Dimension
)
from app.core.config import settings

class GoogleAnalyticsIntegration:
    def __init__(self):
        self.client = BetaAnalyticsDataClient()
        self.property_id = settings.GA_PROPERTY_ID

    async def get_basic_metrics(self, days: int = 30) -> Dict:
        """
        Get basic metrics from Google Analytics
        """
        try:
            request = RunReportRequest(
                property=f"properties/{self.property_id}",
                date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
                metrics=[
                    Metric(name="activeUsers"),
                    Metric(name="sessions"),
                    Metric(name="conversions"),
                    Metric(name="bounceRate")
                ],
                dimensions=[Dimension(name="date")]
            )
            
            response = self.client.run_report(request)
            
            metrics_data = []
            for row in response.rows:
                metrics_data.append({
                    'date': row.dimension_values[0].value,
                    'active_users': row.metric_values[0].value,
                    'sessions': row.metric_values[1].value,
                    'conversions': row.metric_values[2].value,
                    'bounce_rate': row.metric_values[3].value
                })
            
            return {
                'status': 'success',
                'metrics': metrics_data
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    async def get_traffic_sources(self, days: int = 30) -> Dict:
        """
        Get traffic source data from Google Analytics
        """
        try:
            request = RunReportRequest(
                property=f"properties/{self.property_id}",
                date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
                metrics=[
                    Metric(name="sessions"),
                    Metric(name="conversions")
                ],
                dimensions=[Dimension(name="sessionSource")]
            )
            
            response = self.client.run_report(request)
            
            sources_data = []
            for row in response.rows:
                sources_data.append({
                    'source': row.dimension_values[0].value,
                    'sessions': row.metric_values[0].value,
                    'conversions': row.metric_values[1].value
                })
            
            return {
                'status': 'success',
                'sources': sources_data
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    async def get_user_behavior(self, days: int = 30) -> Dict:
        """
        Get user behavior metrics from Google Analytics
        """
        try:
            request = RunReportRequest(
                property=f"properties/{self.property_id}",
                date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
                metrics=[
                    Metric(name="screenPageViews"),
                    Metric(name="averageSessionDuration"),
                    Metric(name="engagementRate")
                ],
                dimensions=[Dimension(name="pagePath")]
            )
            
            response = self.client.run_report(request)
            
            behavior_data = []
            for row in response.rows:
                behavior_data.append({
                    'page': row.dimension_values[0].value,
                    'page_views': row.metric_values[0].value,
                    'avg_duration': row.metric_values[1].value,
                    'engagement_rate': row.metric_values[2].value
                })
            
            return {
                'status': 'success',
                'behavior': behavior_data
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
