<script>
	import { recipes } from '../stores/recipes';
	import { selectedTags } from '../stores/tags';
	import RecipeRow from './recipe-row.svelte';
	import Fade from './fade.svelte';

	$: if ($selectedTags.length > 0) {
		fetch('http://localhost:3001/recipes?tags=' + $selectedTags.map((it) => it.id).join(','))
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
		width: 900px;
	}

	.recipe-row {
		position: relative;
		margin-bottom: 2rem;
	}

	.recipe-row::after {
		--padding-x: 2rem;

		content: '';
		position: absolute;
		background-color: rgba(0, 0, 0, 0.12);
		height: 1px;
		width: calc(100% - (2 * var(--padding-x)));
		margin-top: 2rem;
		margin-left: var(--padding-x);
	}
</style>
