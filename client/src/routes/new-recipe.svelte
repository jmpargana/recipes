<script>
	import TagInput from '../lib/tag-input.svelte';
	import Input from '../lib/input.svelte'
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
	<div class="row">

	<Input id="title" label="Title" />
	<Input id="method" label="Method" />
	</div>
	<Input id="time" label="Time" />
	<TagInput />

	<input type="submit" />
</form>


<style>
	#recipe {
		/* display: flex;
		flex-direction: column; */
	}

	.row {
		display: flex;
	}
</style>
