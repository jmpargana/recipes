<script>
	import { querystring } from 'svelte-spa-router';
	import Chips from '../lib/chips.svelte';

	const recipeId = $querystring.split('=')[1];

	let recipe;

	fetch(`/recipes/${recipeId}`)
		.then((res) => res.json())
		.then((data) => (recipe = data));

	$: tags = recipe?.tags.map((it) => it.name);
</script>

<!-- Replace with await syntax to show error and loading status -->
<div class="recipe-wrapper">
	{#if recipe}
		<h2>{recipe.title}</h2>
		<div class="row">
			<Chips chips={tags} />
			<div class="col">
				<h5><b>Time</b></h5>
				<p>{recipe.time}</p>
			</div>
		</div>
		<h5>Method</h5>
		<p>{recipe.method}</p>
	{/if}
</div>

<style>
	.recipe-wrapper {
		gap: 1rem;
	}

	.row,
	.col,
	.recipe-wrapper {
		display: flex;
		justify-content: space-between;
	}

	.col,
	.recipe-wrapper {
		flex-direction: column;
		justify-content: flex-start;
	}
</style>
