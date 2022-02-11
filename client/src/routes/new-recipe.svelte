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
	<Input id="title" label="Title" />
	<Input id="method" label="Method" />
	<Input id="time" label="Time" />
	<TagInput />
	<input class="btn-submit" type="submit" />
</form>


<style>
  .btn-submit {
		margin-top: var(--space-lg);
    cursor: pointer;
    background-color: var(--color-secondary);
    color: var(--color-bg-primary);
    padding: var(--space-sm) var(--space-xxl);
    border-radius: var(--space-xs);
    transition: all 0.2s ease-in-out;
  }

  .btn-submit:hover {
    background-color: var(--color-tertiary);
    transform: scale(1.03);
    color: var(--color-primary);
  }

	#recipe {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
</style>
