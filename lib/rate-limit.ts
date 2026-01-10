import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// Sprawdź czy mamy konfigurację Redis
const hasRedisConfig = 
  process.env.UPSTASH_REDIS_REST_URL && 
  process.env.UPSTASH_REDIS_REST_TOKEN

// Tworzymy Redis klienta tylko jeśli mamy konfigurację
const redis = hasRedisConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

// Rate limitery dla różnych endpointów
export const rateLimiters = {
  // Publiczne API - 60 requestów na minutę per IP
  publicApi: hasRedisConfig
    ? new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(60, '1m'),
        prefix: 'ratelimit:public',
        analytics: true,
      })
    : null,

  // Dodawanie opinii - 5 na minutę per IP (restrykcyjne)
  addReview: hasRedisConfig
    ? new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(5, '1m'),
        prefix: 'ratelimit:review',
        analytics: true,
      })
    : null,

  // Wyszukiwanie - 30 na minutę per IP
  search: hasRedisConfig
    ? new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(30, '1m'),
        prefix: 'ratelimit:search',
        analytics: true,
      })
    : null,

  // Authenticated API - 120 na minutę per user
  authenticated: hasRedisConfig
    ? new Ratelimit({
        redis: redis!,
        limiter: Ratelimit.slidingWindow(120, '1m'),
        prefix: 'ratelimit:auth',
        analytics: true,
      })
    : null,
}

export type RateLimiterType = keyof typeof rateLimiters

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Sprawdza rate limit dla danego identyfikatora
 * @param type - typ rate limitera
 * @param identifier - IP lub userId
 * @returns RateLimitResult lub null jeśli Redis nie jest skonfigurowany
 */
export async function checkRateLimit(
  type: RateLimiterType,
  identifier: string
): Promise<RateLimitResult | null> {
  const limiter = rateLimiters[type]
  
  if (!limiter) {
    // Brak Redis - pozwalamy na wszystko (dev mode)
    console.warn(`Rate limiting disabled - no Redis config for ${type}`)
    return null
  }

  const result = await limiter.limit(identifier)
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}

/**
 * Zwraca odpowiedź HTTP z informacją o przekroczeniu limitu
 */
export function rateLimitExceededResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    { 
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    },
    { 
      status: 429,
      headers: {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
        'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
      },
    }
  )
}

/**
 * Dodaje nagłówki rate limit do odpowiedzi
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.reset.toString())
  return response
}

/**
 * Pobiera IP z request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  // Fallback dla dev
  return 'unknown-ip'
}

/**
 * Middleware helper - sprawdza rate limit i zwraca error jeśli przekroczony
 */
export async function withRateLimit(
  request: Request,
  type: RateLimiterType,
  identifier?: string
): Promise<NextResponse | null> {
  const id = identifier || getClientIp(request)
  const result = await checkRateLimit(type, id)
  
  if (!result) {
    // Redis nie skonfigurowany - kontynuuj
    return null
  }
  
  if (!result.success) {
    return rateLimitExceededResponse(result)
  }
  
  return null
}
