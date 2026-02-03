const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  EXPIRES_AT: 'expires_at'
} as const

export function getStoredTokens() {
  if (typeof window === 'undefined') return null

  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT)

  // Only access token is required (PocketBase doesn't use refresh tokens the same way)
  if (!accessToken) return null

  return {
    accessToken,
    refreshToken: refreshToken || '',
    expiresAt: expiresAt ? parseInt(expiresAt, 10) : null
  }
}

export function storeTokens(accessToken: string, refreshToken: string, expiresAt: number) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString())
}

export function clearStoredTokens() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT)
}
