import asyncio
from app.integrations.openai_integration import OpenAIIntegration

async def test_market_insights():
    openai_client = OpenAIIntegration()
    
    # Test market insights generation
    result = await openai_client.generate_market_insights(
        industry="SaaS",
        context="B2B software company focusing on project management tools"
    )
    
    print("\nMarket Insights Test:")
    print("Status:", result.get('status'))
    if result.get('status') == 'success':
        print("Insights:", result.get('insights'))
    else:
        print("Error:", result.get('message'))

async def test_growth_strategies():
    openai_client = OpenAIIntegration()
    
    # Test growth strategies generation
    business_data = {
        "industry": "E-commerce",
        "size": "small",
        "revenue": "1M",
        "target_market": "B2C fashion retailers"
    }
    
    result = await openai_client.generate_growth_strategies(business_data)
    
    print("\nGrowth Strategies Test:")
    print("Status:", result.get('status'))
    if result.get('status') == 'success':
        print("Strategies:", result.get('strategies'))
    else:
        print("Error:", result.get('message'))

async def run_tests():
    await test_market_insights()
    await test_growth_strategies()

if __name__ == "__main__":
    asyncio.run(run_tests())
