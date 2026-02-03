<script>
      import { Search } from 'lucide-svelte'
</script>    
    
    <div class="flex-1 flex justify-center">
      <label class="input h-9 flex rounded-full items-center gap-2 w-full max-w-md">
        <Search class="w-4 h-4 opacity-50" />
        <input type="search" class="grow" aria-label="Search" placeholder="Search all notes" />
      </label>
    </div>