<script lang="ts">
  import { user } from '$lib/stores/user.svelte'
  import { Camera } from 'lucide-svelte'

  let firstName = $state(user.firstName || '')
  let lastName = $state(user.lastName || '')
  let email = $state(user.email || '')

  function handleSave() {
    // TODO: Implement save logic
    console.log('Saving profile:', { firstName, lastName, email })
  }
</script>

<div class="space-y-6 max-w-2xl">
  <div>
    <h1 class="text-2xl font-bold">Profile</h1>
    <p class="text-base-content/60">Manage your personal information.</p>
  </div>

  <!-- Avatar Section -->
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <h2 class="card-title text-lg">Avatar</h2>
      <div class="flex items-center gap-4">
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content rounded-full w-20">
            <span class="text-2xl">
              {(firstName?.[0] || '') + (lastName?.[0] || '') || '?'}
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button class="btn btn-sm bg-base-200 border border-base-300">
            <Camera class="h-4 w-4" />
            Upload photo
          </button>
          <p class="text-xs text-base-content/60">JPG, PNG or GIF. Max 2MB.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Personal Info Section -->
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <h2 class="card-title text-lg">Personal Information</h2>
      <div class="grid gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label" for="firstName">
              <span class="label-text">First name</span>
            </label>
            <input
              id="firstName"
              type="text"
              class="input input-bordered bg-base-200 border-base-300"
              bind:value={firstName}
              placeholder="John"
            />
          </div>
          <div class="form-control">
            <label class="label" for="lastName">
              <span class="label-text">Last name</span>
            </label>
            <input
              id="lastName"
              type="text"
              class="input input-bordered bg-base-200 border-base-300"
              bind:value={lastName}
              placeholder="Doe"
            />
          </div>
        </div>
        <div class="form-control">
          <label class="label" for="email">
            <span class="label-text">Email</span>
          </label>
          <input
            id="email"
            type="email"
            class="input input-bordered bg-base-200 border-base-300"
            bind:value={email}
            placeholder="john@example.com"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Save Button -->
  <div class="flex justify-end">
    <button class="btn btn-primary" onclick={handleSave}>
      Save changes
    </button>
  </div>
</div>
