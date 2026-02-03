import { apiRequest, performTokenRefresh, ApiError, NetworkError, isNetworkError } from './client'
import type { AuthResponse, PocketBaseUser } from './client'
import { auth } from '$lib/stores/auth.svelte'
import { user } from '$lib/stores/user.svelte'
import { goto } from '$app/navigation'

function mapUserRecord(record: PocketBaseUser) {
  user.set({
    id: record.id,
    email: record.email,
    emailVerified: record.verified,
    createdAt: record.created
  })
}

export async function login(email: string, password: string): Promise<void> {
  auth.setLoading(true)
  auth.clearError()

  try {
    const response = await apiRequest<AuthResponse>(
      '/api/collections/users/auth-with-password',
      {
        method: 'POST',
        body: JSON.stringify({ identity: email, password })
      }
    )

    // PocketBase tokens are valid for a long time, use 7 days as default
    const expiresIn = 7 * 24 * 60 * 60
    auth.login(response.token, '', expiresIn)
    mapUserRecord(response.record)

    await goto('/dashboard')
  } catch (error) {
    if (error instanceof NetworkError) {
      auth.setError(error.isTimeout ? 'Request timed out. Please try again.' : 'Network error. Please check your connection.')
    } else if (error instanceof ApiError) {
      auth.setError(error.message)
    } else {
      auth.setError('An unexpected error occurred')
    }
    throw error
  } finally {
    auth.setLoading(false)
  }
}

export async function signup(email: string, password: string): Promise<void> {
  auth.setLoading(true)
  auth.clearError()

  try {
    // Create user
    await apiRequest<PocketBaseUser>('/api/collections/users/records', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        passwordConfirm: password
      })
    })

    // Auto-login after signup
    await login(email, password)
  } catch (error) {
    if (error instanceof NetworkError) {
      auth.setError(error.isTimeout ? 'Request timed out. Please try again.' : 'Network error. Please check your connection.')
    } else if (error instanceof ApiError) {
      auth.setError(error.message)
    } else {
      auth.setError('An unexpected error occurred')
    }
    throw error
  } finally {
    auth.setLoading(false)
  }
}

export function logout(): void {
  auth.logout()
  goto('/login')
}

export async function refreshToken(): Promise<void> {
  if (!auth.accessToken) {
    auth.logout()
    throw new Error('No access token available')
  }

  try {
    const response = await performTokenRefresh(auth.accessToken)

    const expiresIn = 7 * 24 * 60 * 60
    auth.setTokens(response.token, '', expiresIn)
    mapUserRecord(response.record)
  } catch (error) {
    // If refresh fails, logout
    auth.logout()
    throw error
  }
}

export async function getCurrentUser(): Promise<void> {
  if (!user.id) return

  try {
    const record = await apiRequest<PocketBaseUser>(
      `/api/collections/users/records/${user.id}`
    )
    mapUserRecord(record)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      auth.logout()
    }
    throw error
  }
}

export { ApiError, NetworkError, isNetworkError }
