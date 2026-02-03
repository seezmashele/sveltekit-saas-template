<script lang="ts">
  type Size = 'sm' | 'md' | 'lg'

  let { size = 'md' }: { size?: Size } = $props()

  const sizeClasses: Record<Size, string> = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  }
</script>

<span class="loading loading-spinner {sizeClasses[size]}"></span>
