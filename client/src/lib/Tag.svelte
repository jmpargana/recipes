<script>
  export let text
  export let color
  export let dark = false
</script>

<div 
  class="tag" 
  style="--color-tag: {color}; --color-text: {dark ? 'white' : 'black'}"
>
  {text}
</div>

<style lang="scss">
  .tag {
    border: var(--space-xxxxs) solid var(--color-tag);
    border-radius: var(--space-md);
    padding: var(--space-xxxxs) var(--space-sm);
    background-color: var(--color-tag);
    color: var(--color-text);
  }
</style>
