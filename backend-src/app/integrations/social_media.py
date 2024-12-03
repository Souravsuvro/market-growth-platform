import tweepy
from app.core.config import settings
from typing import Dict, List
import asyncio

class SocialMediaAnalyzer:
    def __init__(self):
        self.twitter_client = tweepy.Client(
            bearer_token=settings.TWITTER_BEARER_TOKEN
        )

    async def analyze_twitter_sentiment(self, query: str, limit: int = 100) -> Dict:
        try:
            tweets = self.twitter_client.search_recent_tweets(
                query=query,
                max_results=limit,
                tweet_fields=['created_at', 'public_metrics']
            )
            
            # Process tweets and extract metrics
            tweet_data = []
            for tweet in tweets.data or []:
                tweet_data.append({
                    'text': tweet.text,
                    'metrics': tweet.public_metrics,
                    'created_at': tweet.created_at
                })
            
            return {
                'status': 'success',
                'data': tweet_data,
                'count': len(tweet_data)
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    async def get_market_trends(self, location_id: str = '1') -> Dict:
        try:
            trends = self.twitter_client.get_place_trends(id=location_id)
            return {
                'status': 'success',
                'trends': trends[0] if trends else []
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
