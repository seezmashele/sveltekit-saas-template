<script lang="ts">
  import { page } from '$app/state'
  import { user } from '$lib/stores/user.svelte'
  import { LayoutDashboard, FileText, Settings } from 'lucide-svelte'

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

<aside class="w-54 min-h-[calc(100vh-4rem)] bg-base-200 border-r border-base-300 py-4 hidden lg:block">
  <!-- User Section -->
  <div class="flex items-center gap-3 px-4 pb-4">
    <div class="avatar placeholder">
      <div class="bg-base-300 text-center text-neutral-content text-sm rounded-full w-8">{getInitials(user.firstName, user.lastName)}
      </div>
    </div>
    <div class="flex flex-col">
      <span class="font-medium text-sm">{user.fullName || 'User'}</span>
    </div>
  </div>
  <!-- <div class="border-b border-base-300 mx-4 mb-4"></div> -->

  <ul class="menu gap-1 w-full">
    {#each navItems as item}
      <li class="w-full">
        <a
          href={item.href}
          class:active={isActive(item.href)}
          class="btn justify-start gap-3 shadow-none"
        >
          <item.icon class="icon-primary" />
          {item.label}
        </a>
      </li>
    {/each}
  </ul>
</aside>
