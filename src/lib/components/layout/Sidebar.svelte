<script lang="ts">
  import { page } from '$app/state'
  import { user } from '$lib/stores/user.svelte'
  import { app } from '$lib/stores/app.svelte'
  import { LayoutDashboard, FileText, Settings, PanelLeftClose, PanelLeft } from 'lucide-svelte'

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/notes', label: 'Notes', icon: FileText },
    { href: '/settings/profile', label: 'Settings', icon: Settings }
  ]

  function isActive(href: string): boolean {
    return page.url.pathname === href || page.url.pathname.startsWith(href + '/')
  }

  function getInitials(firstName: string | null, lastName: string | null): string {
    const first = firstName?.[0] ?? ''
    const last = lastName?.[0] ?? ''
    return (first + last).toUpperCase() || ''
  }
</script>

<aside class="min-h-[calc(100vh-3.75rem)] bg-base-200 border-r border-base-300 py-2.5 hidden lg:flex flex-col {app.sidebarOpen ? 'w-54' : 'w-14'}">
  <!-- Minimize Button -->
  <div class="px-2.5 flex justify-end">
    <button
      onclick={() => app.toggleSidebar()}
      class="btn btn-ghost w-9 h-9 btn-square"
      aria-label={app.sidebarOpen ? 'Minimize sidebar' : 'Expand sidebar'}
    >
      {#if app.sidebarOpen}
        <PanelLeftClose class="icon-primary" />
      {:else}
        <PanelLeft class="icon-primary" />
      {/if}
    </button>
  </div>

  <!-- Navigation -->
  <ul class="menu px-2.5 gap-1 w-full flex-1">
    {#each navItems as item}
      <li class="w-full">
        <a
          href={item.href}
          class:active={isActive(item.href)}
          class="btn pl-0 duration-0 font-normal justify-start shadow-none {app.sidebarOpen ? '' : 'justify-center px-0'}"
          title={app.sidebarOpen ? undefined : item.label}
        ><div class="w-9 items-center flex justify-center">
          <item.icon class="icon-primary" />
        </div>
          {#if app.sidebarOpen}
            {item.label}
          {/if}
        </a>
      </li>
    {/each}
  </ul>

  <!-- User Section (fixed at bottom) -->
  <div class="flex items-center gap-3 px-3 pt-4 border-t border-base-300 mt-auto {app.sidebarOpen ? '' : 'justify-center px-3'}">
    <div class="avatar placeholder">
      <div class="bg-base-300 text-center text-neutral-content text-sm rounded-full w-8">
        {getInitials(user.firstName, user.lastName)}
      </div>
    </div>
    {#if app.sidebarOpen}
      <div class="flex flex-col">
        <span class="font-medium text-sm">{user.fullName || ''}</span>
      </div>
    {/if}
  </div>
</aside>
