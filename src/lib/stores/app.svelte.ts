import { browser } from '$app/environment'

export type Theme = 'light' | 'dark' | 'system'
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
}

export interface AppState {
  theme: Theme
  sidebarOpen: boolean
  isOnline: boolean
  notifications: Notification[]
}

const STORAGE_KEYS = {
  theme: 'app:theme',
  sidebarOpen: 'app:sidebarOpen'
} as const

function loadFromStorage<T>(key: string, fallback: T): T {
  if (!browser) return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (!browser) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

function createAppStore() {
  let state = $state<AppState>({
    theme: loadFromStorage<Theme>(STORAGE_KEYS.theme, 'system'),
    sidebarOpen: loadFromStorage<boolean>(STORAGE_KEYS.sidebarOpen, true),
    isOnline: browser ? navigator.onLine : true,
    notifications: []
  })

  // Set up online/offline listeners
  if (browser) {
    window.addEventListener('online', () => state.isOnline = true)
    window.addEventListener('offline', () => state.isOnline = false)
  }

  function setTheme(theme: Theme) {
    state.theme = theme
    saveToStorage(STORAGE_KEYS.theme, theme)
    applyTheme(theme)
  }

  function applyTheme(theme: Theme) {
    if (!browser) return

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }

  // Apply theme on initialization
  if (browser) {
    applyTheme(state.theme)

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (state.theme === 'system') {
        applyTheme('system')
      }
    })
  }

  function toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen
    saveToStorage(STORAGE_KEYS.sidebarOpen, state.sidebarOpen)
  }

  function setSidebarOpen(open: boolean) {
    state.sidebarOpen = open
    saveToStorage(STORAGE_KEYS.sidebarOpen, state.sidebarOpen)
  }

  function addNotification(
    type: NotificationType,
    message: string,
    duration: number = 5000
  ): string {
    const id = crypto.randomUUID()
    state.notifications.push({ id, type, message, duration })

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration)
    }

    return id
  }

  function removeNotification(id: string) {
    const index = state.notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      state.notifications.splice(index, 1)
    }
  }

  function clearNotifications() {
    state.notifications = []
  }

  // Convenience methods for notifications
  const notify = {
    success: (message: string, duration?: number) => addNotification('success', message, duration),
    error: (message: string, duration?: number) => addNotification('error', message, duration),
    warning: (message: string, duration?: number) => addNotification('warning', message, duration),
    info: (message: string, duration?: number) => addNotification('info', message, duration)
  }

  return {
    get theme() { return state.theme },
    get sidebarOpen() { return state.sidebarOpen },
    get isOnline() { return state.isOnline },
    get notifications() { return state.notifications },

    setTheme,
    toggleSidebar,
    setSidebarOpen,
    addNotification,
    removeNotification,
    clearNotifications,
    notify
  }
}

export const app = createAppStore()
