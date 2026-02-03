<script lang="ts">
  import { auth } from '$lib/stores/auth.svelte'
  import { goto } from '$app/navigation'
  import Nav from '$lib/components/layout/Nav.svelte'
  import Sidebar from '$lib/components/layout/Sidebar.svelte'
  import Loading from '$lib/components/ui/Loading.svelte'

  let { children } = $props()

  // Guard: redirect to login if not authenticated (wait for init first)
  $effect(() => {
    if (auth.isInitialized && !auth.isAuthenticated) {
      goto('/login')
    }
  })
</script>

{#if !auth.isInitialized || auth.isLoading}
  <div class="flex items-center justify-center min-h-screen">
    <Loading size="lg" />
  </div>
{:else if auth.isAuthenticated}
  <Nav />
  <div class="flex">
    <Sidebar />
    <main class="flex-1 p-6">
      {@render children()}
    </main>
  </div>
{/if}
