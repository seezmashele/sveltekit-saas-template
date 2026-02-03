<script>
    const {title = '', description = ''} = $props()
</script>

<div>
    <h1 class="text-2xl font-semibold">{title}</h1>
    {#if description}
        <p class="text-sm mt-1 text-base-content/60">{description}</p>
    {/if}
</div>