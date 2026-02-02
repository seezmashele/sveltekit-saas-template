import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import { auth } from '$lib/stores/auth.svelte'

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

interface PocketBaseError {
  code: number
  message: string
  data?: Record<string, { code: string; message: string }>
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${PUBLIC_POCKETBASE_URL}${endpoint}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (auth.accessToken) {
    ;(headers as Record<string, string>)['Authorization'] = `Bearer ${auth.accessToken}`
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    let errorData: PocketBaseError
    try {
      errorData = await response.json()
    } catch {
      throw new ApiError(response.status, 'unknown', response.statusText)
    }

    // Extract first field error if available
    const fieldError = errorData.data
      ? Object.values(errorData.data)[0]?.message
      : null

    throw new ApiError(
      response.status,
      errorData.data ? Object.keys(errorData.data)[0] : 'unknown',
      fieldError || errorData.message
    )
  }

  return response.json()
}
