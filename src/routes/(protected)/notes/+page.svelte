<script lang="ts">
  import SectionTitle from '$lib/components/layout/SectionTitle.svelte';
import { ChevronLeft, ChevronRight } from 'lucide-svelte'

  const allNotes = [
    { id: 1, title: 'Project Ideas', category: 'Work', createdAt: '2025-01-28', status: 'Draft' },
    { id: 2, title: 'Meeting Notes - Q1 Planning', category: 'Work', createdAt: '2025-01-27', status: 'Published' },
    { id: 3, title: 'Book Recommendations', category: 'Personal', createdAt: '2025-01-26', status: 'Published' },
    { id: 4, title: 'Recipe Collection', category: 'Personal', createdAt: '2025-01-25', status: 'Draft' },
    { id: 5, title: 'Travel Plans 2025', category: 'Personal', createdAt: '2025-01-24', status: 'Published' },
    { id: 6, title: 'API Documentation', category: 'Work', createdAt: '2025-01-23', status: 'Published' },
    { id: 7, title: 'Weekly Review - Week 4', category: 'Work', createdAt: '2025-01-22', status: 'Published' },
    { id: 8, title: 'Fitness Goals', category: 'Personal', createdAt: '2025-01-21', status: 'Draft' },
    { id: 9, title: 'Product Roadmap Q2', category: 'Work', createdAt: '2025-01-20', status: 'Published' },
    { id: 10, title: 'Movie Watchlist', category: 'Personal', createdAt: '2025-01-19', status: 'Draft' },
    { id: 11, title: 'Client Feedback Summary', category: 'Work', createdAt: '2025-01-18', status: 'Published' },
    { id: 12, title: 'Home Renovation Ideas', category: 'Personal', createdAt: '2025-01-17', status: 'Draft' },
    { id: 13, title: 'Sprint Retrospective', category: 'Work', createdAt: '2025-01-16', status: 'Published' },
    { id: 14, title: 'Gift Ideas', category: 'Personal', createdAt: '2025-01-15', status: 'Published' },
    { id: 15, title: 'Database Schema Notes', category: 'Work', createdAt: '2025-01-14', status: 'Draft' },
    { id: 16, title: 'Vacation Planning', category: 'Personal', createdAt: '2025-01-13', status: 'Published' },
    { id: 17, title: 'Team Standup Notes', category: 'Work', createdAt: '2025-01-12', status: 'Published' },
    { id: 18, title: 'Reading List 2025', category: 'Personal', createdAt: '2025-01-11', status: 'Draft' },
    { id: 19, title: 'Feature Specifications', category: 'Work', createdAt: '2025-01-10', status: 'Published' },
    { id: 20, title: 'Budget Planning', category: 'Personal', createdAt: '2025-01-09', status: 'Published' },
    { id: 21, title: 'Code Review Guidelines', category: 'Work', createdAt: '2025-01-08', status: 'Published' },
    { id: 22, title: 'Meal Prep Ideas', category: 'Personal', createdAt: '2025-01-07', status: 'Draft' },
    { id: 23, title: 'Architecture Decisions', category: 'Work', createdAt: '2025-01-06', status: 'Published' },
    { id: 24, title: 'New Year Resolutions', category: 'Personal', createdAt: '2025-01-05', status: 'Published' }
  ]

  const itemsPerPage = 8
  let currentPage = $state(1)

  const totalPages = $derived(Math.ceil(allNotes.length / itemsPerPage))
  const paginatedNotes = $derived(
    allNotes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  )

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page
    }
  }
</script>

<div class="space-y-6">
<SectionTitle title="Notes" />

  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
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
            {#each paginatedNotes as note}
              <tr class="hover">
                <td class="font-medium">{note.title}</td>
                <td>
                  <span class="badge badge-ghost badge-sm">{note.category}</span>
                </td>
                <td class="text-base-content/60">{note.createdAt}</td>
                <td>
                  <span
                    class="badge badge-sm"
                    class:badge-success={note.status === 'Published'}
                    class:badge-warning={note.status === 'Draft'}
                  >
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

  <!-- Pagination -->
  <div class="relative flex items-center">
    <p class="text-sm text-base-content/60">
      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, allNotes.length)} of {allNotes.length} notes
    </p>
    <div class="join absolute left-1/2 -translate-x-1/2">
      <button
        class="join-item btn btn-sm bg-base-200 border border-base-300"
        onclick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft class="h-4 w-4" />
      </button>
      {#each Array(totalPages) as _, i}
        <button
          class="join-item btn btn-sm bg-base-200 border border-base-300"
          class:btn-active={currentPage === i + 1}
          onclick={() => goToPage(i + 1)}
        >
          {i + 1}
        </button>
      {/each}
      <button
        class="join-item btn btn-sm bg-base-200 border border-base-300"
        onclick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</div>
