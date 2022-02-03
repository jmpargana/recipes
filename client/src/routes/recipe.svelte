<script>
	import { recipes } from '../stores/recipes';
	import { page } from '$app/stores';
	import Chips from '../lib/chips.svelte';

	// TODO: get recipe by id
	$: recipe = $recipes.find((it) => $page.url.searchParams.get('id') == it.id);

	$: tags = recipe.tags.map((it) => it.name);
</script>

<div class="recipe-wrapper">
	<h1>{recipe.title}</h1>
	<Chips chips={tags} />
	<span><b>Time:</b>{recipe.time}</span>
	<p><b>Method:</b>{recipe.method}</p>
</div>
