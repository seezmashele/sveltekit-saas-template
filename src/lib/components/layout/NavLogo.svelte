<img src="/hello_logo_light.svg" alt="main logo" class="logo-light w-40 h-8 object-contain">
<img src="/hello_logo_dark.svg" alt="main logo" class="logo-dark w-40 h-8 object-contain">

<style>
  .logo-dark {
    display: none;
  }

  :global([data-theme="dark"]) .logo-light {
    display: none;
  }

  :global([data-theme="dark"]) .logo-dark {
    display: block;
  }
</style>