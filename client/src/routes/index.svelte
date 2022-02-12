<script>
	import SearchBlock from '../lib/search-block.svelte';
	import RecipeList from '../lib/recipe-list.svelte';
	import Draw from '../lib/Draw.svelte';
	import { fly } from 'svelte/transition';
</script>

<h1 class="title" transition:fly={{ duration: 1000, y: -100 }}>Share Your Recipes</h1>
<Draw />
<div class="homepage-container">
	<SearchBlock />
	<RecipeList />
</div>

<style>
	.title {
		z-index: 100;
		position: absolute;
		color: var(--color-primary);
		overflow: hidden;
	}

	.homepage-container {
		position: absolute;
		inset: 0;
		top: 280px;
		z-index: 200;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xl);
	}

	@media (min-width: 900px) {
		.homepage-container {
			top: 60%;
		}
	}

	@media (min-width: 1500px) {
		.title {
			position: absolute;
			top: 15%;
			left: 10%;
		}
	}

	@media (min-width: 1800px) {
		.homepage-container {
			top: 45%;
		}
	}
</style>
