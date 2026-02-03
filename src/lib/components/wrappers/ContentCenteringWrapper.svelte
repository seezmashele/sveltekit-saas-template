<script lang="ts">
  import DrawerPlaceholder from '$lib/components/wrappers/DrawerPlaceholder.svelte'
  const { children } = $props()
</script>

<div class="flex w-full justify-center">
  <div class="w-full">{@render children()}</div>
  <DrawerPlaceholder shrink={true}><div></div></DrawerPlaceholder>
</div>
