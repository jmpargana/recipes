<script>
	import { recipes } from '../stores/recipes';
	import { page } from '$app/stores';
	import Chips from '../lib/chips.svelte';

	// TODO: get recipe by id
	$: recipe = $recipes.find((it) => $page.url.searchParams.get('id') == it.id);

	$: tags = recipe.tags.map((it) => it.name);
</script>

<div class="recipe-wrapper">
	<h2>{recipe.title}</h2>
	<div class="row">
	<Chips chips={tags} />
	<div class="col">

	<h5><b>Time</h5>
	<p>{recipe.time}</p>
	</div>

	</div>
	<h5>Method</h5>
	<p>{recipe.method}</p>
</div>


<style>
	.recipe-wrapper {
		gap: 1rem;
	}

	.row, .col, .recipe-wrapper {
		display: flex;
		justify-content: space-between;
	}

	.col, .recipe-wrapper {
		flex-direction: column;
		justify-content: flex-start;
	}
</style>