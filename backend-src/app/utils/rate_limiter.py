from fastapi import HTTPException
import redis
import time
from ..core.config import settings
import logging
import json
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self):
        try:
            self.redis_client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=0,
                decode_responses=True
            )
            # More conservative rate limits
            self.window_size = 3600  # 1 hour in seconds
            self.max_requests = 20    # Maximum 20 requests per hour
            self.min_interval = 180   # Minimum 3 minutes between requests
        except Exception as e:
            logger.error(f"Failed to initialize Redis connection: {e}")
            self.redis_client = None

    async def check_rate_limit(self, key_prefix: str) -> bool:
        """Check if the rate limit has been exceeded with exponential backoff"""
        if not self.redis_client:
            return True  # Allow requests if Redis is not available
            
        try:
            current_time = int(time.time())
            hour_key = f"rate_limit:{key_prefix}:{current_time // self.window_size}"
            last_request_key = f"last_request:{key_prefix}"
            backoff_key = f"backoff:{key_prefix}"
            
            pipe = self.redis_client.pipeline()
            
            # Check hourly limit
            pipe.incr(hour_key)
            pipe.expire(hour_key, self.window_size)
            
            # Check last request time
            pipe.get(last_request_key)
            
            # Check backoff multiplier
            pipe.get(backoff_key)
            
            results = pipe.execute()
            hourly_requests = results[0]
            last_request_time = int(results[1]) if results[1] else 0
            backoff_multiplier = int(results[2]) if results[2] else 1
            
            # Check if we're within the hourly limit
            if hourly_requests > self.max_requests:
                logger.warning(f"Hourly rate limit exceeded for {key_prefix}")
                # Increase backoff multiplier
                self.redis_client.setex(backoff_key, self.window_size, min(backoff_multiplier * 2, 8))
                return False
            
            # Check if enough time has passed since last request
            time_since_last = current_time - last_request_time
            required_interval = self.min_interval * backoff_multiplier
            
            if time_since_last < required_interval:
                logger.warning(f"Request too soon, need to wait {required_interval - time_since_last} seconds")
                return False
            
            # Update last request time
            self.redis_client.set(last_request_key, current_time)
            
            # Reset backoff if successful
            if backoff_multiplier > 1:
                self.redis_client.setex(backoff_key, self.window_size, max(backoff_multiplier - 1, 1))
            
            return True
            
        except Exception as e:
            logger.error(f"Rate limiter error: {e}")
            return True  # Allow requests if Redis operation fails

class AICache:
    def __init__(self):
        try:
            self.redis_client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=1,
                decode_responses=True
            )
            self.cache_ttl = 7200  # Cache for 2 hours
            self.max_cache_size = 1000  # Maximum number of cached items
        except Exception as e:
            logger.error(f"Failed to initialize Redis cache: {e}")
            self.redis_client = None

    async def get_cached_response(self, key: str) -> dict:
        """Get cached response for a given key"""
        if not self.redis_client:
            return None
            
        try:
            cached_data = self.redis_client.get(key)
            if cached_data:
                # Update access time for LRU implementation
                self.redis_client.zadd("cache_access", {key: time.time()})
                return json.loads(cached_data)
            return None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None

    async def cache_response(self, key: str, response: dict):
        """Cache response with LRU eviction policy"""
        if not self.redis_client:
            return
            
        try:
            # Check cache size
            cache_size = self.redis_client.zcard("cache_access")
            
            # If cache is full, remove oldest entries
            if cache_size >= self.max_cache_size:
                oldest_keys = self.redis_client.zrange("cache_access", 0, cache_size - self.max_cache_size)
                if oldest_keys:
                    self.redis_client.delete(*oldest_keys)
                    self.redis_client.zrem("cache_access", *oldest_keys)
            
            # Cache new response
            self.redis_client.setex(key, self.cache_ttl, json.dumps(response))
            self.redis_client.zadd("cache_access", {key: time.time()})
            
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            
    async def get_cache_stats(self) -> dict:
        """Get cache statistics"""
        if not self.redis_client:
            return {"status": "disconnected"}
            
        try:
            cache_size = self.redis_client.zcard("cache_access")
            return {
                "status": "connected",
                "cache_size": cache_size,
                "max_size": self.max_cache_size,
                "ttl": self.cache_ttl
            }
        except Exception as e:
            logger.error(f"Cache stats error: {e}")
            return {"status": "error", "message": str(e)}
