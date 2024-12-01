# Market Growth Platform

An intelligent platform that generates strategic business insights using advanced AI technologies.

## 🚀 Features

### Current Features
- **AI-Powered Growth Strategies**: Generate personalized business growth strategies using advanced AI models
- **Smart Rate Limiting**: Intelligent request management with exponential backoff
- **Efficient Caching**: LRU-based caching system for quick response times
- **Fallback Mechanisms**: Graceful degradation when AI services are unavailable
- **Health Monitoring**: Real-time service health and performance metrics

### 🔄 Ongoing Development

#### Authentication System
- Social authentication integration (Facebook, Google)
- JWT-based token management
- Refresh token implementation
- Role-based access control
- User profile management

#### AI and Analytics
- Enhanced prompt engineering for better insights
- Multiple AI model support
- Competitor analysis module
- Market trend prediction
- Customer segmentation analytics

#### Data Processing
- Real-time data processing pipeline
- Advanced metrics calculation
- Historical data analysis
- Custom reporting engine
- Data visualization components

#### Integration Features
- HubSpot CRM integration
- Google Analytics integration
- Social media analytics
- Email marketing automation
- Payment gateway integration

#### Platform Enhancement
- Real-time collaboration features
- Custom dashboard creation
- Advanced notification system
- Automated report generation
- Export functionality for insights

#### Security Enhancements
- Advanced rate limiting strategies
- Data encryption at rest
- Enhanced API security
- Audit logging system
- GDPR compliance features

## 🛠 Tech Stack

- **Backend**: FastAPI
- **AI Integration**: HuggingFace Inference API
- **Caching/Rate Limiting**: Redis
- **Authentication**: JWT-based
- **Database**: PostgreSQL (planned)
- **Message Queue**: RabbitMQ (planned)
- **Search Engine**: Elasticsearch (planned)
- **Monitoring**: Prometheus & Grafana (planned)

## 📋 Prerequisites

- Python 3.12+
- Redis Server
- PostgreSQL (optional)
- HuggingFace API Key (optional)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/market-growth-platform.git
cd market-growth-platform
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the backend directory with:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<your-password>
SECRET_KEY=<your-secret-key>
HUGGINGFACE_API_KEY=  # Optional
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🚀 Running the Application

1. Start Redis server (required for rate limiting and caching)

2. Run the FastAPI server:
```bash
cd backend
python run_server.py
```

The server will start at `http://localhost:8000`

## 🌐 API Endpoints

### Current Endpoints

#### Growth Strategy
- `GET /api/v1/growth-strategy/`: Get default growth strategy
- `POST /api/v1/growth-strategy/`: Generate custom growth strategy
  ```json
  {
    "industry": "Technology",
    "size": "Medium",
    "revenue": "$10M",
    "growth_rate": "15%",
    "target_market": "B2B SaaS",
    "current_challenges": "Customer acquisition costs are high"
  }
  ```
- `GET /api/v1/growth-strategy/health`: Check service health status

### Upcoming Endpoints

#### Authentication
- `POST /api/v1/auth/register`: User registration
- `POST /api/v1/auth/login`: User login
- `POST /api/v1/auth/refresh`: Refresh access token
- `POST /api/v1/auth/social/facebook`: Facebook OAuth
- `POST /api/v1/auth/social/google`: Google OAuth

#### User Management
- `GET /api/v1/users/me`: Get current user profile
- `PUT /api/v1/users/me`: Update user profile
- `GET /api/v1/users/preferences`: Get user preferences
- `PUT /api/v1/users/preferences`: Update user preferences

#### Analytics
- `GET /api/v1/analytics/market-trends`: Get market trends
- `POST /api/v1/analytics/competitor-analysis`: Analyze competitors
- `GET /api/v1/analytics/customer-segments`: Get customer segments
- `POST /api/v1/analytics/custom-reports`: Generate custom reports

#### Integrations
- `POST /api/v1/integrations/hubspot/sync`: Sync HubSpot data
- `GET /api/v1/integrations/google-analytics/metrics`: Get GA metrics
- `POST /api/v1/integrations/email/campaign`: Create email campaign

## ⚙️ Configuration

### Rate Limiting
- Maximum 20 requests per hour
- Minimum 3-minute interval between requests
- Exponential backoff for repeated requests

### Caching
- Cache TTL: 2 hours
- Maximum 1000 cached items
- LRU (Least Recently Used) eviction policy

### Upcoming Configurations
- Distributed rate limiting
- Multi-region caching
- Custom rate limit rules per endpoint
- Advanced cache invalidation strategies

## 🔒 Security

Current Implementation:
- JWT-based authentication
- Secure environment variable handling
- Rate limiting protection
- API key management

Planned Enhancements:
- Two-factor authentication
- IP-based rate limiting
- Request signing
- Advanced audit logging
- Automated security scanning

## 🐛 Troubleshooting

### Common Issues

1. Redis Connection Error
```
Error: Connection refused (localhost:6379)
Solution: Ensure Redis server is running
```

2. Rate Limit Exceeded
```
Error: Rate limit exceeded
Solution: Wait for the cooldown period or implement caching
```

3. HuggingFace API Issues
```
Error: resource_exhausted
Solution: System will automatically fall back to demo data
```

## 🚧 Development Roadmap

### Phase 1 (Current)
- ✅ Basic AI integration
- ✅ Rate limiting
- ✅ Caching system
- ✅ Health monitoring
- 🔄 Authentication system

### Phase 2 (Next)
- User management system
- Enhanced AI capabilities
- Advanced analytics
- Basic integrations
- Initial frontend development

### Phase 3 (Future)
- Advanced integrations
- Real-time collaboration
- Custom reporting
- Mobile app development
- Advanced security features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details
