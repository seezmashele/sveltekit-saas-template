<script lang="ts">
  import SectionTitle from '$lib/components/layout/SectionTitle.svelte';
import { Monitor, Smartphone, LogOut } from 'lucide-svelte'

  let currentPassword = $state('')
  let newPassword = $state('')
  let confirmPassword = $state('')
  let twoFactorEnabled = $state(false)

  const sessions = [
    { id: 1, device: 'Chrome on Windows', location: 'New York, US', lastActive: 'Now', current: true, icon: Monitor },
    { id: 2, device: 'Safari on iPhone', location: 'New York, US', lastActive: '2 hours ago', current: false, icon: Smartphone },
    { id: 3, device: 'Firefox on macOS', location: 'Boston, US', lastActive: '3 days ago', current: false, icon: Monitor }
  ]

  function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    // TODO: Implement password change logic
    console.log('Changing password')
  }

  function handleToggle2FA() {
    // TODO: Implement 2FA toggle logic
    twoFactorEnabled = !twoFactorEnabled
  }

  function handleRevokeSession(sessionId: number) {
    // TODO: Implement session revoke logic
    console.log('Revoking session:', sessionId)
  }
</script>

<div class="space-y-6 max-w-2xl">
  <SectionTitle title="Security" description="Manage your account security settings" />

  <!-- Change Password Section -->
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <h2 class="card-title text-lg">Change Password</h2>
      <div class="grid gap-4">
        <div class="form-control">
          <label class="label" for="currentPassword">
            <span class="label-text">Current password</span>
          </label>
          <input
            id="currentPassword"
            type="password"
            class="input input-bordered bg-base-200 border-base-300"
            bind:value={currentPassword}
            placeholder="Enter current password"
          />
        </div>
        <div class="form-control">
          <label class="label" for="newPassword">
            <span class="label-text">New password</span>
          </label>
          <input
            id="newPassword"
            type="password"
            class="input input-bordered bg-base-200 border-base-300"
            bind:value={newPassword}
            placeholder="Enter new password"
          />
        </div>
        <div class="form-control">
          <label class="label" for="confirmPassword">
            <span class="label-text">Confirm new password</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            class="input input-bordered bg-base-200 border-base-300"
            bind:value={confirmPassword}
            placeholder="Confirm new password"
          />
        </div>
        <div class="flex justify-end">
          <button class="btn btn-primary" onclick={handleChangePassword}>
            Update password
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Two-Factor Authentication Section -->
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="card-title text-lg">Two-Factor Authentication</h2>
          <p class="text-sm text-base-content/60">Add an extra layer of security to your account.</p>
        </div>
        <input
          type="checkbox"
          class="toggle toggle-primary"
          checked={twoFactorEnabled}
          onchange={handleToggle2FA}
        />
      </div>
      {#if twoFactorEnabled}
        <div class="mt-4 p-4 bg-base-200 rounded-lg">
          <p class="text-sm text-base-content/60">
            Two-factor authentication is enabled. You'll need to enter a code from your authenticator app when signing in.
          </p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Active Sessions Section -->
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <h2 class="card-title text-lg">Active Sessions</h2>
      <p class="text-sm text-base-content/60 mb-4">Manage your active sessions across devices.</p>
      <div class="space-y-3">
        {#each sessions as session}
          <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
            <div class="flex items-center gap-3">
              <session.icon class="h-5 w-5 text-base-content/60" />
              <div>
                <p class="font-medium text-sm">
                  {session.device}
                  {#if session.current}
                    <span class="badge badge-success badge-sm ml-2">Current</span>
                  {/if}
                </p>
                <p class="text-xs text-base-content/60">{session.location} · {session.lastActive}</p>
              </div>
            </div>
            {#if !session.current}
              <button
                class="btn btn-ghost btn-sm text-error"
                onclick={() => handleRevokeSession(session.id)}
              >
                <LogOut class="h-4 w-4" />
              </button>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Danger Zone -->
  <div class="card bg-base-100 border border-error/30">
    <div class="card-body">
      <h2 class="card-title text-lg text-error">Danger Zone</h2>
      <p class="text-sm text-base-content/60 mb-4">Permanently delete your account and all associated data.</p>
      <button class="btn btn-error btn-outline w-fit">
        Delete account
      </button>
    </div>
  </div>
</div>
