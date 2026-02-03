<script lang="ts">
  import { app } from '$lib/stores/app.svelte'

  const { children, shrink = false } = $props()
</script>

<!-- the width of the shrinkable drawer is (100vw - (centered content width + drawer width)) -->
<!-- which is (100vw - (72rem + 15rem)) -->
<!-- max-width-[4rem] is the minimised drawer width -->

<div
  class={`${shrink ? 'w-[calc(100vw-103.5rem)]' : 'w-screen'} min-w-0 pointer-events-none relative hidden h-40 max-w-14 transition-none md:flex ${
    app.sidebarOpen && 'lg:max-w-54'
  }`}
>
  {@render children?.()}
</div>
