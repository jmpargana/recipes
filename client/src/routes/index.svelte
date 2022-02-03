<script>
	import SearchBlock from '../lib/search-block.svelte';
	import RecipeList from '../lib/recipe-list.svelte';
</script>

<a href="/new-recipe">New Recipe</a>

<div class="homepage-container">
	<SearchBlock />
	<RecipeList />
</div>

<style>
	.homepage-container {
		display: grid;
		justify-content: center;
	}
</style>
