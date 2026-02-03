# API Client Documentation

## Overview

The API client (`src/lib/api/client.ts`) provides a robust HTTP client for communicating with PocketBase. It handles authentication, automatic token refresh, request timeouts, and error handling.

## Configuration

```typescript
const DEFAULT_TIMEOUT_MS = 30 * 1000        // 30 seconds
const TOKEN_REFRESH_THRESHOLD_MS = 5 * 60 * 1000  // 5 minutes
```

## Core Functions

### `apiRequest<T>(endpoint, options)`

The main function for making API requests.

```typescript
import { apiRequest } from '$lib/api/client'

const data = await apiRequest<UserData>('/api/collections/users/records/123')
```

**Features:**
- Automatically injects auth token
- Proactive token refresh if expiring soon
- Reactive token refresh on 401
- 30 second timeout
- Request queueing during refresh

---

## Token Refresh System

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                      Request Flow                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Check if token expires within 5 minutes                 │
│     └─ Yes → Proactive refresh before request               │
│                                                             │
│  2. Make the request                                        │
│                                                             │
│  3. If 401 response                                         │
│     └─ Reactive refresh + retry                             │
│                                                             │
│  4. Return response or throw error                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Proactive Refresh

Before each request, the client checks if the token will expire within 5 minutes. If so, it refreshes the token *before* making the request, avoiding potential 401 errors.

```
Token expires at: 10:30:00
Current time:     10:26:00
Threshold:        5 minutes

→ Token expires in 4 minutes (< 5 min threshold)
→ Proactive refresh triggered
```

### Reactive Refresh (401 Handling)

If a request returns 401, the client:
1. Starts a token refresh
2. Queues any other requests that fail with 401
3. Retries all queued requests with the new token

### Request Queueing

When multiple requests hit 401 simultaneously:

```
Request A → 401 → Starts refresh, waits
Request B → 401 → Joins queue, waits
Request C → 401 → Joins queue, waits

Refresh completes → new token

Request A → Retries with new token
Request B → Retries with new token
Request C → Retries with new token
```

This prevents multiple simultaneous refresh calls.

---

## Error Handling

### Error Types

```typescript
// API errors (server responded with error)
class ApiError extends Error {
  status: number    // HTTP status code
  code: string      // Error code from PocketBase
  message: string   // Human-readable message
}

// Network errors (request failed to complete)
class NetworkError extends Error {
  isTimeout: boolean  // True if error was due to timeout
  message: string
}
```

### Error Behavior

| Error Type | Logout User? | Description |
|------------|--------------|-------------|
| `ApiError` (401/403) | Yes | Invalid/expired token that can't be refreshed |
| `ApiError` (other) | No | Server error, validation error, etc. |
| `NetworkError` | No | Offline, timeout, DNS failure |

### Checking Error Types

```typescript
import { ApiError, NetworkError, isNetworkError } from '$lib/api/auth'

try {
  await apiRequest('/api/some-endpoint')
} catch (error) {
  if (isNetworkError(error)) {
    // Handle network issues
    if (error.isTimeout) {
      console.log('Request timed out')
    } else {
      console.log('Network error:', error.message)
    }
  } else if (error instanceof ApiError) {
    // Handle API errors
    console.log('API error:', error.status, error.message)
  }
}
```

---

## Endpoints That Skip Refresh

These endpoints don't trigger token refresh on 401 (to prevent infinite loops):

```typescript
const SKIP_REFRESH_ENDPOINTS = [
  '/api/collections/users/auth-refresh',
  '/api/collections/users/auth-with-password'
]
```

---

## Request Timeout

All requests have a 30 second timeout. If exceeded:
- Request is aborted
- `NetworkError` is thrown with `isTimeout: true`
- User is NOT logged out (timeout may be temporary)

---

## File Structure

```
src/lib/api/
├── client.ts     # Core API client, token refresh, error classes
└── auth.ts       # High-level auth functions (login, signup, logout)
```

### client.ts Exports

```typescript
// Functions
export function apiRequest<T>(endpoint, options): Promise<T>
export function performTokenRefresh(token): Promise<AuthResponse>
export function isNetworkError(error): error is NetworkError

// Classes
export class ApiError
export class NetworkError

// Types
export interface PocketBaseUser
export interface AuthResponse
```

### auth.ts Exports

```typescript
// Functions
export function login(email, password): Promise<void>
export function signup(email, password): Promise<void>
export function logout(): void
export function refreshToken(): Promise<void>
export function getCurrentUser(): Promise<void>

// Re-exports from client.ts
export { ApiError, NetworkError, isNetworkError }
```

---

## Usage Examples

### Basic GET Request

```typescript
const user = await apiRequest<PocketBaseUser>(
  `/api/collections/users/records/${userId}`
)
```

### POST Request

```typescript
const response = await apiRequest<AuthResponse>(
  '/api/collections/users/auth-with-password',
  {
    method: 'POST',
    body: JSON.stringify({ identity: email, password })
  }
)
```

### With Error Handling

```typescript
try {
  const data = await apiRequest<MyData>('/api/my-endpoint')
  // Success
} catch (error) {
  if (isNetworkError(error)) {
    showToast('Network error. Please check your connection.')
  } else if (error instanceof ApiError) {
    if (error.status === 404) {
      showToast('Not found')
    } else {
      showToast(error.message)
    }
  }
}
```

---

## Internal Functions (Not Exported)

| Function | Purpose |
|----------|---------|
| `makeRequest()` | Low-level fetch with timeout and headers |
| `parseErrorResponse()` | Extracts error details from PocketBase response |
| `isTokenExpiringSoon()` | Checks if token expires within threshold |
| `proactiveRefreshIfNeeded()` | Refreshes token if expiring soon |
| `handleTokenRefresh()` | Manages 401 refresh + retry flow |
| `processQueue()` | Resolves queued requests with new token |
| `rejectQueue()` | Rejects queued requests on refresh failure |
| `addToQueue()` | Adds request to wait for ongoing refresh |
