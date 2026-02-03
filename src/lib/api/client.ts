import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { auth } from '$lib/stores/auth.svelte'

// Configuration
const DEFAULT_TIMEOUT_MS = 30 * 1000 // 30 seconds
const TOKEN_REFRESH_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes

export interface PocketBaseUser {
  id: string
  email: string
  emailVisibility: boolean
  verified: boolean
  created: string
  updated: string
}

export interface AuthResponse {
  token: string
  record: PocketBaseUser
}

// Token refresh state management
let isRefreshing = false

interface QueuedRequest {
  resolve: (token: string) => void
  reject: (error: Error) => void
}

const failedQueue: QueuedRequest[] = []

/**
 * Process all queued requests with the new token
 */
function processQueue(newToken: string): void {
  failedQueue.forEach(({ resolve }) => resolve(newToken))
  failedQueue.length = 0
}

/**
 * Reject all queued requests with the given error
 */
function rejectQueue(error: Error): void {
  failedQueue.forEach(({ reject }) => reject(error))
  failedQueue.length = 0
}

/**
 * Add a request to the queue to wait for token refresh
 * Returns a promise that resolves with the new token
 */
function addToQueue(): Promise<string> {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject })
  })
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public isTimeout: boolean = false
  ) {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * Check if an error is a network-related error (not an API error)
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError
}

interface PocketBaseError {
  code: number
  message: string
  data?: Record<string, { code: string; message: string }>
}

// Endpoints that should not trigger token refresh on 401
const SKIP_REFRESH_ENDPOINTS = [
  '/api/collections/users/auth-refresh',
  '/api/collections/users/auth-with-password'
]

/**
 * Make a fetch request with the given token and timeout
 */
async function makeRequest(
  url: string,
  options: RequestInit,
  token: string | null,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    })
    return response
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new NetworkError(`Request timeout after ${timeoutMs}ms`, true)
      }
      // Network errors (offline, DNS failure, etc.)
      throw new NetworkError(error.message)
    }
    throw new NetworkError('Unknown network error')
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Parse error response from PocketBase
 */
function parseErrorResponse(errorData: PocketBaseError, status: number, statusText: string): ApiError {
  const fieldError = errorData.data
    ? Object.values(errorData.data)[0]?.message
    : null

  return new ApiError(
    status,
    errorData.data ? Object.keys(errorData.data)[0] : 'unknown',
    fieldError || errorData.message
  )
}

/**
 * Check if token is expiring soon and should be proactively refreshed
 */
function isTokenExpiringSoon(): boolean {
  if (!auth.expiresAt) return false
  return auth.expiresAt - Date.now() < TOKEN_REFRESH_THRESHOLD_MS
}

/**
 * Proactively refresh token if it's expiring soon
 * Returns the current or new token to use for the request
 */
async function proactiveRefreshIfNeeded(): Promise<string | null> {
  if (!auth.accessToken || !isTokenExpiringSoon()) {
    return auth.accessToken
  }

  // If already refreshing, wait for it
  if (isRefreshing) {
    return addToQueue()
  }

  // Start proactive refresh
  isRefreshing = true

  try {
    const refreshResponse = await performTokenRefresh(auth.accessToken)

    const expiresIn = 7 * 24 * 60 * 60
    auth.setTokens(refreshResponse.token, '', expiresIn)

    processQueue(refreshResponse.token)

    return refreshResponse.token
  } catch (error) {
    // Proactive refresh failed - don't logout, just use current token
    // The request might still work, or we'll handle 401 reactively
    rejectQueue(error instanceof Error ? error : new Error('Token refresh failed'))
    return auth.accessToken
  } finally {
    isRefreshing = false
  }
}

/**
 * Handle token refresh and retry the original request
 */
async function handleTokenRefresh<T>(
  endpoint: string,
  url: string,
  options: RequestInit
): Promise<T> {
  const currentToken = auth.accessToken

  if (!currentToken) {
    auth.logout()
    throw new ApiError(401, 'no_token', 'No access token available')
  }

  // If already refreshing, wait in queue
  if (isRefreshing) {
    const newToken = await addToQueue()
    const retryResponse = await makeRequest(url, options, newToken)

    if (!retryResponse.ok) {
      let errorData: PocketBaseError
      try {
        errorData = await retryResponse.json()
      } catch {
        throw new ApiError(retryResponse.status, 'unknown', retryResponse.statusText)
      }
      throw parseErrorResponse(errorData, retryResponse.status, retryResponse.statusText)
    }

    return retryResponse.json()
  }

  // Start refresh
  isRefreshing = true

  try {
    const refreshResponse = await performTokenRefresh(currentToken)

    // Update auth store with new token
    const expiresIn = 7 * 24 * 60 * 60
    auth.setTokens(refreshResponse.token, '', expiresIn)

    // Process queued requests
    processQueue(refreshResponse.token)

    // Retry original request with new token
    const retryResponse = await makeRequest(url, options, refreshResponse.token)

    if (!retryResponse.ok) {
      let errorData: PocketBaseError
      try {
        errorData = await retryResponse.json()
      } catch {
        throw new ApiError(retryResponse.status, 'unknown', retryResponse.statusText)
      }
      throw parseErrorResponse(errorData, retryResponse.status, retryResponse.statusText)
    }

    return retryResponse.json()
  } catch (error) {
    // Reject all queued requests
    rejectQueue(error instanceof Error ? error : new Error('Token refresh failed'))

    // Only logout on auth errors, not network errors
    // Network errors might be temporary (offline, timeout)
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      auth.logout()
    }

    throw error
  } finally {
    isRefreshing = false
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${PUBLIC_POCKETBASE_URL}${endpoint}`
  const shouldSkipRefresh = SKIP_REFRESH_ENDPOINTS.some(e => endpoint.includes(e))

  // Proactively refresh token if expiring soon (skip for auth endpoints)
  let token = auth.accessToken
  if (!shouldSkipRefresh && token) {
    token = await proactiveRefreshIfNeeded()
  }

  const response = await makeRequest(url, options, token)

  // Handle 401 - attempt token refresh and retry (fallback if proactive refresh didn't help)
  if (response.status === 401 && !shouldSkipRefresh && auth.accessToken) {
    return handleTokenRefresh<T>(endpoint, url, options)
  }

  if (!response.ok) {
    let errorData: PocketBaseError
    try {
      errorData = await response.json()
    } catch {
      throw new ApiError(response.status, 'unknown', response.statusText)
    }
    throw parseErrorResponse(errorData, response.status, response.statusText)
  }

  return response.json()
}

/**
 * Low-level token refresh that uses fetch directly.
 * Does NOT update stores - caller is responsible for that.
 * This allows client.ts to refresh tokens without circular imports.
 */
export async function performTokenRefresh(currentToken: string): Promise<AuthResponse> {
  const url = `${PUBLIC_POCKETBASE_URL}/api/collections/users/auth-refresh`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      signal: controller.signal
    })

    if (!response.ok) {
      let errorData: PocketBaseError
      try {
        errorData = await response.json()
      } catch {
        throw new ApiError(response.status, 'unknown', response.statusText)
      }

      throw new ApiError(
        response.status,
        'auth_refresh_failed',
        errorData.message || 'Token refresh failed'
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new NetworkError('Token refresh timeout', true)
      }
      throw new NetworkError(error.message)
    }
    throw new NetworkError('Unknown network error during token refresh')
  } finally {
    clearTimeout(timeoutId)
  }
}
