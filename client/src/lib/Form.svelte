<script>
	import SvelteMarkdown from 'svelte-markdown';
	import { schema, ingridientSchema } from '../utils/form';

	let label = false;
	let edit = true;
	let errors = {};
	let recipe = { title: '', time: null, method: '', ingridients: [], tags: [] };
	let ingridient = { name: '', amount: '' };

	function deleteTag(tag) {
		recipe = { ...recipe, tags: recipe.tags.filter((t) => t !== tag) };
	}

	async function handleTag(e) {
		const newVal = e.target.value;

		if (e.key === 'Enter' && newVal) {
			if (recipe.tags.some((tag) => tag === newVal)) {
				errors = { ...errors, tags: "Can't use the same tag twice" };
				return;
			}

			recipe = { ...recipe, tags: [...recipe.tags, newVal] };
			e.target.value = '';
		}
	}

	async function handleValidation() {
		try {
			await schema.validate(recipe, { abortEarly: false });
			return true;
		} catch (err) {
			errors = err.inner.reduce((acc, err) => ({ ...acc, [err.path]: err.message }), {});
			console.log(errors);
			return false;
		}
	}

	async function handleSubmit() {
		const isValid = await handleValidation();
		if (!isValid) return;
		try {
			const res = await fetch('/api', {
				method: 'POST',
				body: JSON.stringify(recipe)
			});
			// FIXME: open card with result
			console.log(res);
		} catch (err) {
			console.error(err);
			// FIXME: Deal with fetch error
		}
	}

	async function handleIngridient() {
		try {
			await ingridientSchema.validate(ingridient, { abortEarly: false });
			recipe = { ...recipe, ingridients: [...recipe.ingridients, ingridient] };
			ingridient = { name: '', amount: '' };
		} catch (err) {}
	}
</script>

<form on:change|preventDefault={handleValidation}>
	<div class="grid-container">
		<div class="grid span2">
			<input class="input" type="text" id="title" bind:value={recipe.title} />
			<label class="label" for="title">Title</label>
		</div>
		<div class="grid">
			<label for="">Time</label>
			<input type="text" bind:value={recipe.time} />
		</div>
		<div class="grid span3">
			<label for="tag">Tags</label>
			<input type="text" id="tag" on:keyup|preventDefault={handleTag} />
		</div>
		<div class="span3 flex">
			{#each recipe.tags as tag}
				<div class="tag" on:click={deleteTag(tag)}>{tag}</div>
			{/each}
		</div>
		<div class="grid">
			<label for="">Ingridient</label>
			<input type="text" bind:value={ingridient.name} />
		</div>
		<div class="grid">
			<label for="">Amount</label>
			<input type="text" bind:value={ingridient.amount} />
		</div>
		<button class="btn" on:click|preventDefault={handleIngridient}>Add Ingridient</button>

		<div class="grid span3">
			<label for="method">Method</label>
			<div class="flex">
				<div class="tab" on:click={() => (edit = true)}>Edit</div>
				<div class="tab" on:click={() => (edit = false)}>Preview</div>
			</div>

			{#if edit}
				<div id="edit" class="panel">
					<textarea bind:value={recipe.method} name="method" id="method" />
				</div>
			{:else}
				<div id="preview" class="panel">
					<SvelteMarkdown bind:source={recipe.method} />
				</div>
			{/if}
		</div>
	</div>
	<div class="ingridients-container">
		<span>Ingridients</span>
		<ul>
			{#each recipe.ingridients as i}
				<li>{i.name} {i.amount}</li>
			{/each}
		</ul>
	</div>
	<div class="submit">
		<input type="submit" on:click|preventDefault={handleSubmit} placeholder="Submit" />
	</div>
</form>

<style>
	form {
		max-width: 1000px;
		display: grid;
		gap: 2rem;
		grid-template-columns: 3fr 1fr;
	}

	.grid-container {
		display: grid;
		gap: 1rem;
		grid-template-columns: 2fr 2fr 1fr;
	}

	.submit {
		grid-column: span 2;
		display: grid;
		place-items: center;
	}

	.tag {
		padding: 0.4rem 0.8rem;
		background: orange;
		border-radius: 20px;
	}

	textarea {
		border: none;
		overflow: auto;
		background-color: transparent;
		outline: none;
		box-shadow: none;
		resize: none;
		width: 100%;
		height: 100%;
	}

	.panel {
		height: 200px;
		border: 1px solid black;
	}
</style>
