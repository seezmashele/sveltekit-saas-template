<script lang="ts">
  import { auth } from '$lib/stores/auth.svelte'
  import { user } from '$lib/stores/user.svelte'
  import { app } from '$lib/stores/app.svelte'
  import { Monitor, Moon, Sun, Bell, X } from 'lucide-svelte'
    import NavLogo from './NavLogo.svelte';

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

<nav class="navbar bg-base-100 border-b dark:border-base-500 border-base-300 px-5">
  <!-- Logo -->
  <div class="flex-1">
    <a aria-label="logo" href="/" class="btn hover:bg-transparent hover:shadow-none btn-ghost px-0 text-xl">
       <NavLogo />
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
        <Sun class="h-5 w-5" />
      {:else if app.theme === 'dark'}
        <Moon class="h-5 w-5" />
      {:else}
        <Monitor class="h-5 w-5" />
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
            <Bell class="h-5 w-5" />
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
                      <X class="h-4 w-4" />
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
