<script lang="ts">
  import Nav from '$lib/components/layout/Nav.svelte'
  import LoginForm from '$lib/components/auth/LoginForm.svelte'
</script>

<Nav />

<main class="min-h-screen flex items-center justify-center px-4 py-12 bg-base-200">
  <LoginForm />
</main>
