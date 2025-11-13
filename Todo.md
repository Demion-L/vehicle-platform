# Redis Implementation Todo

## Prerequisites

- Redis server (can be run via Docker)
- Redis client library for NestJS (`@nestjs/cache-manager` + `cache-manager-redis-store` or `ioredis`)
- Understanding of Redis data structures and commands

---

## 1. Session Management & Authentication

### Overview
Implement Redis-based session management and authentication token storage for secure user sessions.

### Goals
- Store JWT refresh tokens in Redis
- Implement token blacklist for logout functionality
- Store session data (user info, login status)
- Track login attempts and implement account lockout
- Store temporary authentication tokens (e.g., password reset tokens)

### Implementation Tasks

#### 1.1 Setup Redis Module
- [ ] Install Redis dependencies in `user-service`
  - `@nestjs/cache-manager`
  - `cache-manager-redis-store` or `ioredis`
  - `@nestjs/config` (if not already installed)
- [ ] Create Redis configuration in `user-service/src/config/redis.config.ts`
- [ ] Add Redis connection settings to environment variables
  - `REDIS_HOST` (default: localhost)
  - `REDIS_PORT` (default: 6379)
  - `REDIS_PASSWORD` (optional)
  - `REDIS_TTL` (default token TTL)

#### 1.2 Create Authentication Module
- [ ] Create `user-service/src/auth/` directory structure
- [ ] Implement `auth.service.ts` with methods:
  - `storeRefreshToken(userId: number, token: string, ttl: number)`
  - `getRefreshToken(userId: number): Promise<string | null>`
  - `removeRefreshToken(userId: number)`
  - `blacklistToken(token: string, ttl: number)`
  - `isTokenBlacklisted(token: string): Promise<boolean>`
- [ ] Implement `auth.module.ts` and register Redis provider
- [ ] Create JWT strategy and guards for token validation

#### 1.3 Token Management
- [ ] Implement refresh token storage with user ID as key
  - Key format: `refresh_token:{userId}`
  - TTL: 7 days (configurable)
- [ ] Implement token blacklist
  - Key format: `blacklisted_token:{tokenHash}`
  - TTL: matches token expiration time
- [ ] Add token validation middleware that checks blacklist

#### 1.4 Session Management
- [ ] Store user session data in Redis
  - Key format: `session:{userId}`
  - Store: user info, login timestamp, last activity
  - TTL: 30 minutes (extends on activity)
- [ ] Implement session cleanup on logout
- [ ] Add session validation in authentication guards

#### 1.5 Security Features
- [ ] Implement login attempt tracking
  - Key format: `login_attempts:{email}`
  - Store: attempt count, lockout expiration
  - Lockout after 5 failed attempts for 15 minutes
- [ ] Store password reset tokens
  - Key format: `reset_token:{token}`
  - TTL: 1 hour
  - Store: userId, expiration timestamp

### Technical Considerations
- Use Redis `SET` with `EX` for TTL management
- Use Redis `GET`, `SET`, `DEL` for token operations
- Use Redis `INCR` and `EXPIRE` for login attempt tracking
- Hash tokens before storing in blacklist to save memory
- Implement connection pooling for Redis client

### Testing
- [ ] Unit tests for authentication service methods
- [ ] Integration tests for token storage and retrieval
- [ ] Test token blacklist functionality
- [ ] Test session expiration and cleanup
- [ ] Test login attempt lockout mechanism

---

## 2. Caching Layer

### Overview
Implement Redis caching to reduce database load and improve response times for frequently accessed data.

### Goals
- Cache user data (getUserById, getAllUsers)
- Cache vehicle data (getVehicleById, getAllVehicles, getVehiclesByUserId)
- Implement cache-aside pattern
- Set appropriate TTLs for different data types
- Implement cache invalidation on data updates

### Implementation Tasks

#### 2.1 Setup Caching Infrastructure
- [ ] Install caching dependencies in both services
  - `@nestjs/cache-manager`
  - `cache-manager-redis-store` or `ioredis`
- [ ] Create `cache.module.ts` in both `user-service` and `vehicle-service`
- [ ] Configure Redis cache with connection settings
- [ ] Add cache configuration to environment variables
  - `REDIS_CACHE_TTL` (default: 300 seconds)
  - `REDIS_CACHE_MAX` (max items in cache)

#### 2.2 User Service Caching
- [ ] Update `user.service.ts` to implement caching:
  - Cache `getById(userId)` - TTL: 10 minutes
    - Key format: `user:{userId}`
  - Cache `getAll()` - TTL: 5 minutes
    - Key format: `users:all`
  - Cache user by email lookup - TTL: 10 minutes
    - Key format: `user:email:{email}`
- [ ] Implement cache-aside pattern:
  - Check cache before database query
  - Store result in cache after database query
  - Invalidate cache on create/update/delete operations
- [ ] Add cache invalidation methods:
  - `invalidateUserCache(userId: number)`
  - `invalidateAllUsersCache()`

#### 2.3 Vehicle Service Caching
- [ ] Update `vehicles.service.ts` to implement caching:
  - Cache `findOne(vehicleId)` - TTL: 10 minutes
    - Key format: `vehicle:{vehicleId}`
  - Cache `findAll()` - TTL: 5 minutes
    - Key format: `vehicles:all`
  - Cache vehicles by user ID - TTL: 10 minutes
    - Key format: `vehicles:user:{userId}`
- [ ] Implement cache-aside pattern
- [ ] Add cache invalidation methods:
  - `invalidateVehicleCache(vehicleId: number)`
  - `invalidateUserVehiclesCache(userId: number)`
  - `invalidateAllVehiclesCache()`

#### 2.4 Cache Invalidation Strategy
- [ ] Invalidate user cache when:
  - User is created → invalidate `users:all`
  - User is updated → invalidate `user:{userId}` and `user:email:{email}`
  - User is deleted → invalidate all user-related caches
- [ ] Invalidate vehicle cache when:
  - Vehicle is created → invalidate `vehicles:all` and `vehicles:user:{userId}`
  - Vehicle is updated → invalidate `vehicle:{vehicleId}` and `vehicles:user:{userId}`
  - Vehicle is deleted → invalidate all vehicle-related caches
- [ ] Handle cache invalidation in RabbitMQ event handlers
  - When `USER_CREATED` event is processed, invalidate user cache

#### 2.5 Cache Decorators (Optional Enhancement)
- [ ] Create custom cache decorators for cleaner code
  - `@CacheUser(key: string, ttl?: number)`
  - `@CacheInvalidate(keys: string[])`
- [ ] Apply decorators to controller methods

### Technical Considerations
- Use Redis `SET` with `EX` for TTL
- Use Redis `GET` for cache retrieval
- Use Redis `DEL` or `UNLINK` for cache invalidation
- Use Redis `MGET` for batch cache retrieval (optional optimization)
- Consider using Redis `SETEX` for atomic set-with-expiration
- Implement cache warming for frequently accessed data
- Monitor cache hit/miss rates

### Cache Key Naming Convention
```
user:{userId}                    # Single user
users:all                        # All users
user:email:{email}               # User by email
vehicle:{vehicleId}              # Single vehicle
vehicles:all                     # All vehicles
vehicles:user:{userId}           # Vehicles by user ID
```

### Testing
- [ ] Unit tests for cache service methods
- [ ] Integration tests for cache-aside pattern
- [ ] Test cache invalidation on data updates
- [ ] Test cache TTL expiration
- [ ] Load testing to measure performance improvement

---

## 3. API Rate Limiting

### Overview
Implement Redis-based rate limiting to protect APIs from abuse and ensure fair usage.

### Goals
- Implement per-user rate limiting
- Implement per-IP rate limiting
- Different rate limits for different endpoints
- Configurable rate limit windows (sliding window or fixed window)
- Return appropriate HTTP headers (X-RateLimit-*)

### Implementation Tasks

#### 3.1 Setup Rate Limiting Module
- [ ] Install rate limiting dependencies
  - `@nestjs/throttler` (NestJS rate limiting module)
  - `@nestjs/throttler-storage-redis` (Redis storage for throttler)
- [ ] Create `throttler.config.ts` in both services
- [ ] Configure rate limiting in `app.module.ts`
- [ ] Add rate limit configuration to environment variables
  - `RATE_LIMIT_TTL` (default: 60 seconds)
  - `RATE_LIMIT_MAX` (default: 10 requests)
  - `RATE_LIMIT_USER_MAX` (default: 100 requests per minute)
  - `RATE_LIMIT_IP_MAX` (default: 50 requests per minute)

#### 3.2 User Service Rate Limiting
- [ ] Configure global rate limiting (all endpoints)
  - Limit: 100 requests per minute per IP
- [ ] Configure endpoint-specific rate limiting:
  - `POST /users` (user creation): 5 requests per minute per IP
  - `GET /users` (list users): 30 requests per minute per user
  - `GET /users/:id` (get user): 60 requests per minute per user
  - `PUT /users/:id` (update user): 10 requests per minute per user
  - `DELETE /users/:id` (delete user): 3 requests per minute per user
- [ ] Implement authenticated user rate limiting
  - Use user ID from JWT token for user-specific limits
  - Fallback to IP address if user is not authenticated

#### 3.3 Vehicle Service Rate Limiting
- [ ] Configure global rate limiting
  - Limit: 100 requests per minute per IP
- [ ] Configure endpoint-specific rate limiting:
  - `GET /vehicles` (list vehicles): 30 requests per minute per user
  - `GET /vehicles/:id` (get vehicle): 60 requests per minute per user
  - `POST /vehicles` (create vehicle): 10 requests per minute per user
  - `PUT /vehicles/:id` (update vehicle): 10 requests per minute per user
  - `DELETE /vehicles/:id` (delete vehicle): 5 requests per minute per user
- [ ] Implement user-based rate limiting using user ID from request

#### 3.4 Rate Limiting Storage
- [ ] Use Redis for rate limiting counters
  - Key format for IP: `rate_limit:ip:{ipAddress}:{endpoint}`
  - Key format for user: `rate_limit:user:{userId}:{endpoint}`
- [ ] Implement sliding window algorithm using Redis
  - Use Redis `INCR` to increment counter
  - Use Redis `EXPIRE` to set TTL
  - Use Redis `TTL` to get remaining time
- [ ] Store rate limit metadata in Redis
  - Current count
  - Window start time
  - Limit threshold

#### 3.5 Rate Limit Headers
- [ ] Add rate limit headers to responses:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Timestamp when the rate limit resets
- [ ] Return `429 Too Many Requests` when limit is exceeded
- [ ] Include `Retry-After` header in 429 responses

#### 3.6 Advanced Rate Limiting (Optional)
- [ ] Implement different rate limits for different user roles
  - Admin users: Higher limits
  - Regular users: Standard limits
  - Guest users: Lower limits
- [ ] Implement rate limit bypass for internal services
- [ ] Add rate limit monitoring and logging
- [ ] Implement rate limit alerts for suspicious activity

### Technical Considerations
- Use Redis `INCR` for atomic counter increments
- Use Redis `EXPIRE` for automatic cleanup
- Use Redis `MULTI/EXEC` for atomic operations (if needed)
- Implement sliding window or token bucket algorithm
- Consider using Redis Lua scripts for complex rate limiting logic
- Monitor rate limit hit rates and adjust limits accordingly

### Rate Limiting Algorithms

#### Sliding Window (Recommended)
- More accurate but slightly more complex
- Uses Redis sorted sets or multiple keys with timestamps

#### Fixed Window
- Simpler implementation
- Uses Redis `INCR` with `EXPIRE`
- May allow bursts at window boundaries

#### Token Bucket
- Allows bursts up to bucket size
- More complex but very flexible

### Testing
- [ ] Unit tests for rate limiting service
- [ ] Integration tests for rate limiting middleware
- [ ] Test rate limit headers in responses
- [ ] Test 429 response when limit exceeded
- [ ] Test rate limit reset after window expires
- [ ] Load testing to verify rate limiting works under load

---

## Implementation Order

### Phase 1: Caching Layer (Start Here)
1. Setup Redis infrastructure
2. Implement caching in User Service
3. Implement caching in Vehicle Service
4. Add cache invalidation
5. Test and optimize

### Phase 2: Session Management & Authentication
1. Setup authentication module
2. Implement token storage
3. Implement session management
4. Add security features (login attempts, etc.)
5. Test authentication flow

### Phase 3: API Rate Limiting
1. Setup rate limiting infrastructure
2. Configure rate limits for User Service
3. Configure rate limits for Vehicle Service
4. Add rate limit headers
5. Test and monitor

---

## Redis Setup

### Docker Setup (Recommended)
Add Redis to your Docker Compose setup:

```yaml
redis:
  image: redis:7-alpine
  container_name: redis
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  command: redis-server --appendonly yes

volumes:
  redis_data:
```

### Environment Variables
Add to both service `.env` files:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=3600

# Cache Configuration
REDIS_CACHE_TTL=300
REDIS_CACHE_MAX=1000

# Rate Limiting Configuration
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=10
RATE_LIMIT_USER_MAX=100
RATE_LIMIT_IP_MAX=50
```

---

## Monitoring & Maintenance

### Redis Monitoring
- [ ] Setup Redis monitoring (Redis Insight or similar)
- [ ] Monitor memory usage
- [ ] Monitor key expiration
- [ ] Monitor cache hit/miss rates
- [ ] Monitor rate limit hits

### Performance Optimization
- [ ] Tune Redis configuration for your workload
- [ ] Implement connection pooling
- [ ] Use Redis pipelines for batch operations
- [ ] Monitor and optimize cache TTLs
- [ ] Implement cache warming strategies

---

## Resources

### Documentation
- [NestJS Cache Manager](https://docs.nestjs.com/techniques/caching)
- [Redis Documentation](https://redis.io/docs/)
- [NestJS Throttler](https://github.com/nestjs/throttler)
- [ioredis](https://github.com/redis/ioredis)

### Learning Resources
- Redis University courses
- Redis data structures tutorial
- NestJS caching patterns
- Rate limiting algorithms

---

## Notes

- Start with Phase 1 (Caching) as it provides immediate value and is easier to learn
- Test each phase thoroughly before moving to the next
- Monitor Redis memory usage and adjust TTLs accordingly
- Consider Redis persistence (RDB/AOF) for production environments
- Use Redis cluster for high availability in production

---

## AWS Deployment (PostgreSQL) - TODO

- [ ] Configure AWS RDS Postgres for production
  - [ ] Create RDS instance and security groups
  - [ ] Create two databases: `vehiclesdb`, `usersdb`
  - [ ] Create separate DB users/roles per service with least-privileged access
  - [ ] Store credentials in AWS Secrets Manager or SSM Parameter Store
  - [ ] Update both services to point to the same RDS endpoint via `DB_HOST`
  - [ ] Keep existing env structure; only host/credentials differ from local
  - [ ] Add VPC/subnet/security group rules for app-to-RDS connectivity
  - [ ] Document backup/restore strategy and automated snapshots

