<script lang="ts">
	import { onMount } from 'svelte'
	import { auth } from '$lib/stores/auth.svelte'
	import { refreshToken } from '$lib/api/auth'
	import favicon from '$lib/assets/favicon.svg'
	import "$lib/styles/app.css"

	let { children } = $props()

	onMount(async () => {
		auth.initFromStorage()

		// If we have a stored token, validate it and fetch user data
		if (auth.isAuthenticated) {
			try {
				await refreshToken()
			} catch {
				// Token invalid, user will be logged out by refreshToken()
			}
		}
	})
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}