<script lang="ts">
  import { auth } from '$lib/stores/auth.svelte'
  import { user } from '$lib/stores/user.svelte'
  import { app } from '$lib/stores/app.svelte'

  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' }
  ]

  function cycleTheme() {
    const themes = ['light', 'dark', 'system'] as const
    const currentIndex = themes.indexOf(app.theme)
    const nextIndex = (currentIndex + 1) % themes.length
    app.setTheme(themes[nextIndex])
  }

  function getInitials(firstName: string | null, lastName: string | null): string {
    const first = firstName?.[0] ?? ''
    const last = lastName?.[0] ?? ''
    return (first + last).toUpperCase() || '?'
  }

  function handleLogout() {
    auth.logout()
  }
</script>

<nav class="navbar bg-base-100 border-b border-base-300 px-5">
  <!-- Logo -->
  <div class="flex-1">
    <a aria-label="logo" href="/" class="btn btn-ghost text-xl">
      <div class="h-8 w-40 bg-primary/20 rounded"></div>
    </a>
  </div>

  <div class="flex items-center gap-2">
    <!-- Theme Toggle -->
    <button
      class="btn btn-ghost btn-circle"
      onclick={cycleTheme}
      aria-label="Toggle theme"
      title={`Theme: ${app.theme}`}
    >
      {#if app.theme === 'light'}
        <!-- Sun icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      {:else if app.theme === 'dark'}
        <!-- Moon icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      {:else}
        <!-- System/Auto icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      {/if}
    </button>

    {#if auth.isAuthenticated}
      <!-- Notifications Dropdown -->
      <div class="dropdown dropdown-end">
        <button tabindex="0" class="btn btn-ghost btn-circle">
          <div class="indicator">
            {#if app.notifications.length > 0}
              <span class="indicator-item badge badge-primary badge-xs">{app.notifications.length}</span>
            {/if}
            <!-- Bell icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </button>
        <div tabindex="0" class="dropdown-content z-[1] card card-compact w-80 bg-base-100 shadow-lg border border-base-300 mt-3">
          <div class="card-body">
            <h3 class="font-semibold text-lg">Notifications</h3>
            {#if app.notifications.length === 0}
              <p class="text-base-content/60">No notifications</p>
            {:else}
              <ul class="space-y-2 max-h-64 overflow-y-auto">
                {#each app.notifications as notification (notification.id)}
                  <li class="flex items-start gap-2 p-2 rounded-lg bg-base-200">
                    <span class="badge badge-{notification.type === 'error' ? 'error' : notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'info'} badge-sm mt-0.5"></span>
                    <span class="flex-1 text-sm">{notification.message}</span>
                    <button
                      class="btn btn-ghost btn-xs"
                      onclick={() => app.removeNotification(notification.id)}
                      aria-label="Dismiss notification"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                {/each}
              </ul>
              <button class="btn btn-ghost btn-sm mt-2" onclick={() => app.clearNotifications()}>
                Clear all
              </button>
            {/if}
          </div>
        </div>
      </div>

      <!-- Avatar Dropdown -->
      <div class="dropdown dropdown-end">
        <button tabindex="0" class="btn btn-ghost btn-circle avatar">
          {#if user.avatarUrl}
            <div class="w-10 rounded-full">
              <img alt="User avatar" src={user.avatarUrl} />
            </div>
          {:else}
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-10">
                <span class="text-sm">{getInitials(user.firstName, user.lastName)}</span>
              </div>
            </div>
          {/if}
        </button>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300 mt-3">
          <li class="menu-title px-4 py-2">
            <span class="font-medium">{user.fullName || user.email}</span>
            {#if user.isPro}
              <span class="badge badge-primary badge-sm ml-2">Pro</span>
            {/if}
          </li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/settings/profile">Profile</a></li>
          <li><a href="/settings/security">Security</a></li>
          <div class="divider my-1"></div>
          <li><button onclick={handleLogout} class="text-error">Logout</button></li>
        </ul>
      </div>
    {:else}
      <!-- Login/Signup Buttons -->
      <a href="/login" class="btn btn-ghost">Login</a>
      <a href="/signup" class="btn btn-primary">Sign up</a>
    {/if}
  </div>
</nav>
