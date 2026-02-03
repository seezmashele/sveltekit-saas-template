<script lang="ts">
  import { page } from '$app/state'
  import { LayoutDashboard, Settings, User, Shield, CreditCard } from 'lucide-svelte'

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/settings/profile', label: 'Profile', icon: User },
    { href: '/settings/security', label: 'Security', icon: Shield },
    { href: '/settings/billing', label: 'Billing', icon: CreditCard }
  ]

  function isActive(href: string): boolean {
    return page.url.pathname === href
  }
</script>

<aside class="w-54 min-h-[calc(100vh-4rem)] bg-base-200 border-r border-base-300 p-4 hidden lg:block">
  <ul class="menu gap-1">
    {#each navItems as item}
      <li class="w-full">
        <a
          href={item.href}
          class:active={isActive(item.href)}
        >
          <item.icon class="icon-primary" />
          {item.label}
        </a>
      </li>
    {/each}
  </ul>
</aside>
