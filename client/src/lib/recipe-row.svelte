<script>
  import { push } from "svelte-spa-router";
  // import { goto } from '$app/navigation';
  import Chips from "../lib/chips.svelte";

  export let recipe = {};

  function handleSelect() {
    // goto(`/recipe?id=${recipe.id}`);
    push(`/recipe?id=${recipe.id}`);
  }
</script>

<div class="recipe-row" on:click={handleSelect}>
  <div class="recipe-left">
    <h3 class="recipe-title">{recipe.title}</h3>
    <Chips chips={recipe.tags.map((it) => it.name)} />
  </div>
  <div class="recipe-right">
    <span class="recipe-time">{recipe.time}</span>
  </div>
</div>

<style>
  .recipe-row {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    transition: all 100ms ease-in;
  }

  .recipe-row:hover {
    transform: translateX(10px) rotate(1deg) scale(1.005);
  }

  .recipe-left,
  .recipe-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .recipe-title {
    font-size: 32px;
  }

  .recipe-time {
    font-size: 20px;
  }
</style>
