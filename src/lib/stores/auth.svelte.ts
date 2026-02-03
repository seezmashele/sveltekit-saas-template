import { user } from './user.svelte'
import { getStoredTokens, storeTokens, clearStoredTokens } from '$lib/utils/storage'

export interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
}

const defaultState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  isLoading: false,
  isInitialized: false,
  error: null
}

function createAuthStore() {
  let state = $state<AuthState>({ ...defaultState })

  function setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    const expiresAt = Date.now() + expiresIn * 1000
    state.accessToken = accessToken
    state.refreshToken = refreshToken
    state.expiresAt = expiresAt
    state.isAuthenticated = true
    state.error = null
    storeTokens(accessToken, refreshToken, expiresAt)
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
    clearStoredTokens()
    user.clear()
  }

  async function initFromStorage() {
    state.isLoading = true
    const tokens = getStoredTokens()

    if (tokens && tokens.expiresAt && tokens.expiresAt > Date.now()) {
      state.accessToken = tokens.accessToken
      state.refreshToken = tokens.refreshToken
      state.expiresAt = tokens.expiresAt
      state.isAuthenticated = true
    } else {
      clearStoredTokens()
    }

    state.isLoading = false
    state.isInitialized = true
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
    get isInitialized() { return state.isInitialized },
    get error() { return state.error },

    login,
    logout,
    setTokens,
    setLoading,
    setError,
    clearError,
    isTokenExpired,
    initFromStorage
  }
}

export const auth = createAuthStore()
