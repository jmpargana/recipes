<script>
	import { onDestroy } from 'svelte';
	import InputBlock from '$lib/InputBlock.svelte';
	import Markdown from '$lib/Markdown.svelte';
	import { recipe } from '../store/recipe';
	import { errors } from '../store/errs';
	import { validate } from '../utils/form';

	let v = validate(errors, recipe);
	// FIXME: pointer updating all objects
	let ingridient = { name: '', amount: '' };

	async function handleSubmit() {
		// v.completeValidation()
		const res = await fetch('http://localhost:3000/api', {
			method: 'POST',
			body: JSON.stringify($recipe)
		});
		// FIXME: open card with result
		console.log(res);
	}

	function handleIngridient() {
		ingridient = v.ingridient(ingridient);
	}

	onDestroy(v.recipeUnsubscriber);
</script>

<h1>Upload Section</h1>

<div class="form-container">
	<div class="grid-container">
		<InputBlock value={$recipe.title} label={'Title'} />
		<InputBlock customEvent={v.time} err={$errors.time} label={'Time'} />
		<InputBlock customEvent={v.tag} err={$errors.tag} span={2} label={'Tags'} />
		<div class="tags">
			{#each $recipe.tags as tag}
				<div class="tag">{tag}</div>
			{/each}
		</div>
		<div class="block">
			<label for="">Ingridient</label>
			<input type="text" bind:value={ingridient.name} />
		</div>
		<div class="block">
			<label for="">Amount</label>
			<input type="text" bind:value={ingridient.amount} />
		</div>

		<Markdown />
	</div>
	<div class="ingridients-container">
		<button on:click={handleIngridient}>Add Ingridient</button>
		<span>Ingridients</span>

		<ul>
			{#each $recipe.ingridients as i}
				<li>{i.name} {i.amount}</li>
			{/each}
		</ul>
	</div>
	<div class="submit">
		<button on:click={handleSubmit}>Submit</button>
	</div>
</div>

<style>
	.submit {
		grid-column: span 2;
		display: grid;
		place-items: center;
	}

	.form-container {
		display: grid;
		grid-template-columns: repeat(4, 1f);
		padding: 8rem;
		gap: 1rem;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}

	.tags {
		grid-column: span 2;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		padding: 0.4rem 0.8rem;
		background: orange;
		border-radius: 20px;
	}

	.block {
		display: grid;
	}
</style>
