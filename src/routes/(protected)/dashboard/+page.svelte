<script lang="ts">
  import { FileText, TrendingUp, Star, Clock } from 'lucide-svelte'

  const stats = [
    { label: 'Total Notes', value: '24', icon: FileText, change: '+3 this week' },
    { label: 'This Month', value: '12', icon: TrendingUp, change: '+50% vs last month' },
    { label: 'Favorites', value: '6', icon: Star, change: '25% of total' },
    { label: 'Last Updated', value: '2h ago', icon: Clock, change: 'Project Ideas' }
  ]

  const recentNotes = [
    { id: 1, title: 'Project Ideas', category: 'Work', createdAt: '2025-01-28', status: 'Draft' },
    { id: 2, title: 'Meeting Notes - Q1 Planning', category: 'Work', createdAt: '2025-01-27', status: 'Published' },
    { id: 3, title: 'Book Recommendations', category: 'Personal', createdAt: '2025-01-26', status: 'Published' },
    { id: 4, title: 'Recipe Collection', category: 'Personal', createdAt: '2025-01-25', status: 'Draft' },
    { id: 5, title: 'Travel Plans 2025', category: 'Personal', createdAt: '2025-01-24', status: 'Published' },
    { id: 6, title: 'API Documentation', category: 'Work', createdAt: '2025-01-23', status: 'Published' }
  ]
</script>

<div class="space-y-6">
  <!-- <div>
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <p class="text-base-content/60">Welcome back! Here's an overview of your notes.</p>
  </div> -->

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each stats as stat}
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-base-content/60">{stat.label}</p>
              <p class="text-2xl font-bold">{stat.value}</p>
              <p class="text-xs text-base-content/50 mt-1">{stat.change}</p>
            </div>
            <div class="bg-primary/10 p-3 rounded-lg">
              <stat.icon class="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Recent Notes Table -->
  <div class="card px-0 bg-base-100 border border-base-300">
    <div class="card-body">
      <h2 class="card-title text-lg">Recent Notes</h2>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {#each recentNotes as note}
              <tr class="hover">
                <td class="font-medium">{note.title}</td>
                <td>
                  <span class="badge badge-ghost badge-sm">{note.category}</span>
                </td>
                <td class="text-base-content/60">{note.createdAt}</td>
                <td>
                  <span class="badge badge-sm" class:badge-success={note.status === 'Published'} class:badge-warning={note.status === 'Draft'}>
                    {note.status}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
