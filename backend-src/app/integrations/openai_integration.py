from typing import Dict, List
import openai
from app.core.config import settings

class OpenAIIntegration:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY

    async def generate_market_insights(self, industry: str, context: str) -> Dict:
        """
        Generate market insights using OpenAI's GPT model
        """
        try:
            response = await openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a market analysis expert."},
                    {"role": "user", "content": f"Analyze the market for {industry} with the following context: {context}"}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return {
                'status': 'success',
                'insights': response.choices[0].message.content,
                'usage': response.usage
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    async def generate_growth_strategies(self, business_data: Dict) -> Dict:
        """
        Generate growth strategies based on business data
        """
        try:
            prompt = f"""
            Based on the following business data:
            Industry: {business_data.get('industry')}
            Size: {business_data.get('size')}
            Current Revenue: {business_data.get('revenue')}
            Target Market: {business_data.get('target_market')}
            
            Generate specific growth strategies and recommendations.
            """
            
            response = await openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a business growth strategist."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            return {
                'status': 'success',
                'strategies': response.choices[0].message.content,
                'usage': response.usage
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    async def analyze_competitor_data(self, competitor_info: List[Dict]) -> Dict:
        """
        Analyze competitor data and generate insights
        """
        try:
            competitors_text = "\n".join([
                f"Competitor {i+1}: {comp.get('name')}\n"
                f"Market Share: {comp.get('market_share')}\n"
                f"Strengths: {comp.get('strengths')}\n"
                f"Weaknesses: {comp.get('weaknesses')}\n"
                for i, comp in enumerate(competitor_info)
            ])
            
            response = await openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a competitive analysis expert."},
                    {"role": "user", "content": f"Analyze the following competitor data and provide strategic insights:\n{competitors_text}"}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            return {
                'status': 'success',
                'analysis': response.choices[0].message.content,
                'usage': response.usage
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
