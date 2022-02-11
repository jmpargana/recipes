<script>
  import "../app.css"
  import Nav from '../lib/nav.svelte'
</script>


<Nav />
<div class="container-outer">
  <div class="container-inner">
    <slot />
  </div>
</div>

<style>
  .container-outer {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: var(--space-sm);
    padding-top: var(--space-lg);
  }

  .container-inner {
    max-width: 800px;
    width: 100%;
  }
</style>