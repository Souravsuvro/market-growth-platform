from typing import Dict, List
import openai
from app.core.config import settings
from app.integrations.social_media import SocialMediaAnalyzer
import pandas as pd
from sklearn.cluster import KMeans
from transformers import pipeline

class MarketAnalysisService:
    def __init__(self):
        self.social_media = SocialMediaAnalyzer()
        self.sentiment_analyzer = pipeline("sentiment-analysis")
        openai.api_key = settings.OPENAI_API_KEY

    async def analyze_market_trends(self, industry: str, location: str) -> Dict:
        try:
            # Get social media trends
            social_trends = await self.social_media.get_market_trends()
            
            # Analyze industry-specific sentiment
            sentiment = await self.social_media.analyze_twitter_sentiment(
                query=f"{industry} {location}"
            )
            
            # Get AI-powered market insights
            market_insights = await self._get_ai_market_insights(industry, location)
            
            return {
                'trends': social_trends,
                'sentiment': sentiment,
                'market_insights': market_insights
            }
        except Exception as e:
            return {'error': str(e)}

    async def _get_ai_market_insights(self, industry: str, location: str) -> Dict:
        try:
            # Use OpenAI to generate market insights
            response = await openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a market analysis expert."},
                    {"role": "user", "content": f"Provide market insights for {industry} in {location}"}
                ]
            )
            
            return {
                'insights': response.choices[0].message.content,
                'confidence': response.choices[0].finish_reason == 'stop'
            }
        except Exception as e:
            return {'error': str(e)}

    async def segment_customers(self, customer_data: List[Dict]) -> Dict:
        try:
            # Convert customer data to DataFrame
            df = pd.DataFrame(customer_data)
            
            # Perform customer segmentation using KMeans
            kmeans = KMeans(n_clusters=4, random_state=42)
            segments = kmeans.fit_predict(df[['revenue', 'frequency', 'recency']])
            
            return {
                'segments': segments.tolist(),
                'segment_centers': kmeans.cluster_centers_.tolist()
            }
        except Exception as e:
            return {'error': str(e)}

    async def predict_market_size(self, industry_data: Dict) -> Dict:
        try:
            # Simple market size prediction using historical data
            df = pd.DataFrame(industry_data['historical_data'])
            
            # Calculate growth rate and market size
            growth_rate = df['market_size'].pct_change().mean()
            current_size = df['market_size'].iloc[-1]
            predicted_size = current_size * (1 + growth_rate)
            
            return {
                'current_size': current_size,
                'predicted_size': predicted_size,
                'growth_rate': growth_rate
            }
        except Exception as e:
            return {'error': str(e)}
