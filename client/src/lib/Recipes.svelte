<script>
  import Recipe from '../lib/Recipe.svelte'
  import Spinner from '../lib/Spinner.svelte'
  import Divider from '../lib/Divider.svelte'
  import { recipes }  from '../store/recipe.js'
  
  // TODO: Trigger paginated call to backend on infinite scroll
</script>


<div class="center-screen">
  {#await $recipes}
    <Spinner />
  {:then recipes}
    {#each recipes as recipe, i}
      <Recipe recipe={recipe} />
      {#if i < recipes.length - 1}
        <Divider />
      {/if}
    {/each}
  {/await}
</div>

<style lang="scss">
  .center-screen {
    display: grid;
    justify-content: center;

    /* TODO: use scss var */
    @media (min-width: 770px) {
      /* TODO: use css spacing var */
      margin-top: 100px;
    }
  }
</style>
