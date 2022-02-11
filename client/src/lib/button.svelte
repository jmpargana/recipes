<script>
  export let label
  export let sm
</script>

<button class="btn" class:btn-sm={sm} on:click|preventDefault>
  {label}
</button>

<style>
  .btn {
    cursor: pointer;
    background-color: var(--color-primary);
    color: var(--color-bg-primary);
    padding: var(--space-sm) var(--space-xxl);
    border-radius: var(--space-xs);
    transition: all 0.3s ease-in-out;
  }

  .btn-sm {
    padding: var(--space-sm) var(--space-lg);
  }

  .btn:hover {
    background-color: var(--color-tertiary);
    transform: scale(1.03);
    /* color: var(--color-text-secondary); */
  }
</style>