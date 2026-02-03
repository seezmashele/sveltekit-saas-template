<script lang="ts">
  import { auth } from '$lib/stores/auth.svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import Nav from '$lib/components/layout/Nav.svelte'

  let { children } = $props()

  // Pages where authenticated users should be redirected to dashboard
  const authPages = ['/login', '/signup']

  $effect(() => {
    if (auth.isInitialized && auth.isAuthenticated && authPages.includes(page.url.pathname)) {
      goto('/dashboard')
    }
  })
</script>

<Nav />
<main>
  {@render children()}
</main>
