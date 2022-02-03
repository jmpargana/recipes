<script>
	import TagInput from '../lib/tag-input.svelte';
	import { newTags } from '../stores/tags';
	import { goto } from '$app/navigation';

	function handleSubmit(e) {
		e.preventDefault();
		e.stopPropagation();

		const newRecipe = {
			title: e.target[0].value,
			method: e.target[1].value,
			time: parseInt(e.target[2].value),
			tags: $newTags.map((it) => ({ name: it }))
		};

		fetch('http://localhost:3001/recipes', {
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(newRecipe)
		})
			.then(() => {
				newTags.reset();
				goto('/');
			})
			.catch((err) => {});
	}
</script>

<form id="recipe" on:submit={handleSubmit}>
	<label for="title">Title</label>
	<input required id="title" type="text" name="title" />
	<label for="method">Method</label>
	<input required id="method" type="text" name="method" />

	<div class="row">
		<label for="time">Time</label>
		<input required id="time" type="number" name="time" />
		<TagInput />
	</div>

	<input type="submit" />
</form>

<style>
	#recipe {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: flex;
	}
</style>
