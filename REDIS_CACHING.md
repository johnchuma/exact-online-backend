# Redis Caching Implementation

## Overview

This implementation adds Redis caching to the Exact Online backend to improve performance for frequently accessed data, particularly products and services endpoints.

## Features

### Cached Endpoints

#### Products

- `GET /products` - General product listing with filtering
- `GET /products/new` - New arrival products
- `GET /products/for-you` - Personalized product recommendations
- `GET /products/search/:keyword` - Product search results
- `GET /products/shop/:id` - Products by shop
- `GET /products/related/product/:id` - Related products
- `GET /products/:id` - Individual product details

#### Services

- `GET /services` - General service listing with filtering
- `GET /services/new` - New arrival services
- `GET /services/for-you` - Personalized service recommendations
- `GET /services/popular` - Popular services
- `GET /services/search/:keyword` - Service search results
- `GET /services/shop/:id` - Services by shop
- `GET /services/related/service/:id` - Related services
- `GET /services/:id` - Individual service details

### Cache Configuration

#### TTL (Time To Live) Settings

- **Product/Service listings**: 300 seconds (5 minutes)
- **Individual product/service details**: 600 seconds (10 minutes)
- **Search results**: 600 seconds (10 minutes)
- **Personalized content** (for-you): 180 seconds (3 minutes) - shorter for freshness

#### Cache Keys Structure

Cache keys are structured to support:

- User-specific caching (authenticated vs guest users)
- Category-based filtering
- Keyword-based searching
- Pagination parameters

Example cache key patterns:

```
user:123:products:cat:electronics:kw:phone:limit:10:offset:0:page:1
guest:products:cat:all:kw:all:limit:10:offset:0:page:1
user:456:service:789
guest:search:products:smartphone
```

### Cache Invalidation

#### Automatic Invalidation

Cache is automatically invalidated when:

- Products/services are created, updated, or deleted
- Related shop or category data changes

#### Invalidation Patterns

- Product/service specific: `*:product:123`, `*:service:456`
- Shop specific: `*:shop:789:*`
- Category specific: `*:products:cat:electronics:*`
- General patterns: `*:products:*`, `*:services:*`

## Setup

### Prerequisites

1. Redis server installed and running
2. Node.js Redis client package installed: `npm install redis`

### Environment Configuration

Add to your `.env` file:

```env
# Redis Configuration (optional - defaults to localhost)
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD=your_redis_password  # if authentication is required
REDIS_DB=0
```

### Redis Server Installation

#### macOS (using Homebrew)

```bash
brew install redis
brew services start redis
```

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### Docker

```bash
docker run --name redis-cache -p 6379:6379 -d redis:alpine
```

### Testing Redis Connection

Run the test script to verify Redis is working:

```bash
node test-redis.js
```

## Implementation Details

### Architecture

- **Redis Client**: Singleton pattern with connection management
- **Cache Middleware**: Generic middleware that can be configured for different endpoints
- **Cache Utils**: Helper functions for generating consistent cache keys
- **Automatic Invalidation**: Integrated into create/update/delete operations

### Error Handling

- Redis connection failures don't break the application
- Cache operations are wrapped in try-catch blocks
- Fallback to database queries if cache is unavailable
- Comprehensive logging for debugging

### Performance Benefits

- Reduced database load for frequently accessed data
- Faster response times for cached endpoints
- Scalable caching strategy that supports both authenticated and guest users
- Intelligent cache invalidation prevents stale data

## Monitoring and Maintenance

### Key Metrics to Monitor

- Cache hit/miss ratios
- Redis memory usage
- Response time improvements
- Database query reduction

### Maintenance Tasks

- Monitor Redis memory usage and configure appropriate eviction policies
- Adjust TTL values based on usage patterns
- Review cache key patterns for optimization
- Monitor logs for cache-related errors

## Best Practices

1. **Cache Key Design**: Use consistent, hierarchical key patterns
2. **TTL Strategy**: Balance between freshness and performance
3. **Invalidation**: Be specific but comprehensive when invalidating
4. **Error Handling**: Always provide fallbacks for cache failures
5. **Monitoring**: Track cache performance and adjust accordingly

## Troubleshooting

### Common Issues

1. **Redis Connection Refused**: Check if Redis server is running
2. **High Memory Usage**: Monitor cache size and adjust TTL/eviction policies
3. **Stale Data**: Verify invalidation patterns are comprehensive
4. **Performance Issues**: Check cache hit ratios and key distribution

### Debug Commands

```bash
# Connect to Redis CLI
redis-cli

# Monitor Redis operations
redis-cli monitor

# Check memory usage
redis-cli info memory

# List all keys (use carefully in production)
redis-cli keys "*"
```
