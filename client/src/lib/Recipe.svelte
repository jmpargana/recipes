<script>
  import Tag from './Tag.svelte'
  export let recipe
</script>

<div class="list-elem flex-between">
  <div class="column">
    <div class="title">{recipe.title}</div>
    <div class="flex tags">
      {#each recipe.tags as tag}
        <Tag text={tag.text} color={tag.color} dark={tag.dark} />
      {/each}
    </div>
  </div>
  <div class="column">
    <div class="time">{recipe.time}</div>
  </div>
</div>

<style lang="scss">
  $sm: 660px;
  $md: 960px;
  $lg: 1600px;

  .list-elem {
    --padding: 1rem;
    --max-width: calc(100vw - 2 * var(--padding));
    padding: var(--padding);
    width: var(--max-width);

    @media (min-width: $sm) {
      --max-width: 600px;
    }

    @media (min-width: $md) {
      --max-width: 800px;
    }

    @media (min-width: $lg) {
      --max-width: 1000px;
    }
  }

  .title {
    font-size: var(--text-lg);
    padding-bottom: 0.5rem;
  }

  .tags {
    --gap: 0.2rem;
    gap: var(--gap);

    @media (min-width: $sm) {
      --gap: 0.4rem;
    }

    @media (min-width: $md) {
      --gap: 0.8rem;
    }
  }
</style>
