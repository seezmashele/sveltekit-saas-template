<script>
    const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' }
  ]
</script>

<nav class="h-14 w-full justify-between border-b border-neutral-200 flex items-center px-5">
    <a aria-label="logo" href="/">
        <div  class="h-8 w-40 bg-blue-100"></div>
    </a>
    
    <div class="flex items-center gap-2 ">
        <a href="/login" class="btn">Login</a>
        <a href="/signup" class="btn">Signup</a>
    </div>
</nav>