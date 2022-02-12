<script>
	import { recipes } from '../stores/recipes';
	import { selectedTags } from '../stores/tags';
	import RecipeRow from './recipe-row.svelte';
	import Fade from './fade.svelte';

	$: if ($selectedTags.length > 0) {
		fetch('/recipes?tags=' + $selectedTags.map((it) => it.id).join(','))
			.then((res) => res.json())
			.then((data) => ($recipes = data));
	}
</script>

<div class="recipe-list">
	{#each $recipes as recipe, i}
		<Fade fromLeft={i % 2 === 0}>
			<div class="recipe-row">
				<RecipeRow {recipe} />
			</div>
		</Fade>
	{/each}
</div>

<style>
	.recipe-list {
		width: 90vw;
		max-width: 900px;
	}

	.recipe-row {
		position: relative;
		margin-bottom: var(--space-xxs);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		padding: 2rem;
		background-color: white;
		border-radius: 20px;
	}

	/* .recipe-row::after {
		--padding-x: 2rem;

		content: '';
		position: absolute;
		background-color: rgba(0, 0, 0, 0.12);
		height: 1px;
		width: calc(100% - (2 * var(--padding-x)));
		margin-top: 2rem;
		margin-left: var(--padding-x);
	} */
</style>
