import { user } from './user'

export interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  isLoading: boolean
  error: string | null
}

const defaultState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  isLoading: false,
  error: null
}

function createAuthStore() {
  let state = $state<AuthState>({ ...defaultState })

  function setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    state.accessToken = accessToken
    state.refreshToken = refreshToken
    state.expiresAt = Date.now() + expiresIn * 1000
    state.isAuthenticated = true
    state.error = null
  }

  function login(accessToken: string, refreshToken: string, expiresIn: number) {
    setTokens(accessToken, refreshToken, expiresIn)
  }

  function logout() {
    state.isAuthenticated = false
    state.accessToken = null
    state.refreshToken = null
    state.expiresAt = null
    state.error = null
    user.clear()
  }

  function setLoading(loading: boolean) {
    state.isLoading = loading
  }

  function setError(error: string | null) {
    state.error = error
  }

  function clearError() {
    state.error = null
  }

  function isTokenExpired(): boolean {
    if (!state.expiresAt) return true
    return Date.now() >= state.expiresAt
  }

  return {
    get isAuthenticated() { return state.isAuthenticated },
    get accessToken() { return state.accessToken },
    get refreshToken() { return state.refreshToken },
    get expiresAt() { return state.expiresAt },
    get isLoading() { return state.isLoading },
    get error() { return state.error },

    login,
    logout,
    setTokens,
    setLoading,
    setError,
    clearError,
    isTokenExpired
  }
}

export const auth = createAuthStore()
