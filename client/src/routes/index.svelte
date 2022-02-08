<script>
	import SearchBlock from '../lib/search-block.svelte';
	import RecipeList from '../lib/recipe-list.svelte';
</script>


<h1>Share Your Recipes</h1>
<h2>Share Your Recipes</h2>
<h3>Share Your Recipes</h3>
<h4>Share Your Recipes</h4>
<h5>Share Your Recipes</h5>
<h6>Share Your Recipes</h6>
<p>Share Your Recipes</p>

<a href="/new-recipe">New Recipe</a>

<div class="homepage-container">
	<!-- <SearchBlock /> -->
	<RecipeList />
</div>

<style>
	.homepage-container {
		display: grid;
		justify-content: center;
	}
</style>
