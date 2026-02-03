<script lang="ts">
  import { createForm } from '@tanstack/svelte-form'
  import { signup } from '$lib/api/auth'
  import { auth } from '$lib/stores/auth.svelte'

  const form = createForm(() => ({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit: async ({ value }) => {
      await signup(value.email, value.password)
    }
  }))
</script>

<div class="card bg-base-100 py-6 border border-base-300 w-full max-w-md">
  <div class="card-body">
    <h2 class="card-title text-2xl font-bold justify-center mb-6">Create your account</h2>

    {#if auth.error}
      <div class="alert alert-error mb-4">
        <span>{auth.error}</span>
      </div>
    {/if}

    <form
      onsubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'Email is required'
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'
            return undefined
          }
        }}
      >
        {#snippet children(field)}
          <div class="form-control mb-4">
            <label class="label" for="email">
              <span class="label-text">Email</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              class="input input-bordered w-full"
              class:input-error={field.state.meta.errors.length > 0}
              value={field.state.value}
              onblur={() => field.handleBlur()}
              oninput={(e) => field.handleChange(e.currentTarget.value)}
            />
            {#if field.state.meta.errors.length > 0}
              <label class="label">
                <span class="label-text-alt text-error">{field.state.meta.errors[0]}</span>
              </label>
            {/if}
          </div>
        {/snippet}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'Password is required'
            if (value.length < 8) return 'Password must be at least 8 characters'
            return undefined
          }
        }}
      >
        {#snippet children(field)}
          <div class="form-control mb-4">
            <label class="label" for="password">
              <span class="label-text">Password</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              class="input input-bordered w-full"
              class:input-error={field.state.meta.errors.length > 0}
              value={field.state.value}
              onblur={() => field.handleBlur()}
              oninput={(e) => field.handleChange(e.currentTarget.value)}
            />
            {#if field.state.meta.errors.length > 0}
              <label class="label">
                <span class="label-text-alt text-error">{field.state.meta.errors[0]}</span>
              </label>
            {/if}
          </div>
        {/snippet}
      </form.Field>

      <form.Field
        name="confirmPassword"
        validators={{
          onChangeListenTo: ['password'],
          onChange: ({ value, fieldApi }) => {
            if (!value) return 'Please confirm your password'
            const password = fieldApi.form.getFieldValue('password')
            if (value !== password) return 'Passwords do not match'
            return undefined
          }
        }}
      >
        {#snippet children(field)}
          <div class="form-control mb-6">
            <label class="label" for="confirmPassword">
              <span class="label-text">Confirm Password</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="input input-bordered w-full"
              class:input-error={field.state.meta.errors.length > 0}
              value={field.state.value}
              onblur={() => field.handleBlur()}
              oninput={(e) => field.handleChange(e.currentTarget.value)}
            />
            {#if field.state.meta.errors.length > 0}
              <label class="label">
                <span class="label-text-alt text-error">{field.state.meta.errors[0]}</span>
              </label>
            {/if}
          </div>
        {/snippet}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {#snippet children([canSubmit, isSubmitting])}
          <button
            type="submit"
            class="btn btn-primary w-full"
            disabled={!canSubmit || auth.isLoading}
          >
            {#if auth.isLoading || isSubmitting}
              <span class="loading loading-spinner loading-sm"></span>
              Creating account...
            {:else}
              Create account
            {/if}
          </button>
        {/snippet}
      </form.Subscribe>
    </form>

    <div class="divider">OR</div>

    <p class="text-center text-sm">
      Already have an account?
      <a href="/login" class="link link-primary">Sign in</a>
    </p>
  </div>
</div>
